from django.utils import timezone
from datetime import *
import json,uuid
from django.http import JsonResponse
from django.forms.models import model_to_dict
from Eventapp.models import *
from Eventapp.forms import *
from Eventapp.Email import TicketEmail
from django.middleware.csrf import get_token
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from django.db.models import Q
from Eventapp.serializers import EventSerializer,ArtistSerializer,BookingdetailsSerializer
from rest_framework.decorators import api_view

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def events(request):
    try:
        Events_list = Events.objects.all()
        serializer=EventSerializer(Events_list,many=True)
        data = serializer.data 
        for i, event in enumerate(Events_list):
            data[i]["event_image"] = event.image_url
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


    
def contact(request):
    return JsonResponse({"page": "Contact", "content": "Contact us at support@example.com"})

def artists(request):
    try:
        artists_qs = Artists.objects.all()
        serializer = ArtistSerializer(artists_qs, many=True)
        artists_list = serializer.data
        for i, artist in enumerate(artists_qs):
            artists_list[i]["artist_image"] = artist.image_url
        return JsonResponse(artists_list,safe=False)
    except Exception as e:
        return JsonResponse({"error": {e}}, status=404)

def artist_detail(request, artistname):
    try:
        artist = Artists.objects.get(artistname__iexact=artistname)
        event_ids = list(Eventartist.objects.filter(artistid=artist).values_list('event_id', flat=True))
        events_queryset = Events.objects.filter(event_id__in=event_ids)
        eventSerializer=EventSerializer(events_queryset,many=True)
        Eventdata = eventSerializer.data 
        for i, event in enumerate(events_queryset):
            Eventdata[i]["event_image"] = event.image_url
        artistSerializer = ArtistSerializer(artist)
        artistsData = artistSerializer.data
        artistsData["artist_image"] = artist.image_url
        data = {
            "artist": artistsData,
            "events":Eventdata ,
        }
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({"error": {e}}, status=404)

def EventList(request, id):
    try:
        events_queryset = Events.objects.filter(event_id=id)
        artist_ids = Eventartist.objects.filter(event_id=id).values_list('artistid', flat=True)
        artists_queryset = Artists.objects.filter(artistid__in=artist_ids)
        eventSerializer=EventSerializer(events_queryset,many=True)
        Eventdata = eventSerializer.data 
        for i, event in enumerate(events_queryset):
            Eventdata[i]["event_image"] = event.image_url
        artistSerializer = ArtistSerializer(artists_queryset, many=True)
        artistsData = artistSerializer.data
        for i, artist in enumerate(artists_queryset):
            artistsData[i]["artist_image"] = artist.image_url
        data={
            "events": Eventdata,
            "artists": artistsData}
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)

def BookingTickets(request, id):
    try:
        event = Events.objects.get(event_id=id)
        username = request.session.get('username', '')
        emailaddress = request.session.get('email', '')
        seats_str = request.GET.get('seats', '1')
        try:
            seats = int(seats_str)
        except ValueError:
            seats = 1
        request.session['selected_seats'] = seats
        if request.method == 'GET':
            Addtocart = True
            Addtocart = not Addtocart if request.GET.get("toggle") == "1" else Addtocart
            EventId = request.GET.get('events_id', str(id))
            eventSerializer=EventSerializer(event)
            Eventdata = eventSerializer.data 
            Eventdata["event_image"] = event.image_url
            response = {
                "events": Eventdata,
                "Addtocart": Addtocart,
                "EventId": EventId,
                "booking_details": None,
                "emailaddress": emailaddress,
                "username": username,
                "seats": seats
            }
            return JsonResponse(response, safe=False)
        elif request.method == 'POST':
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON data"}, status=400)
            form = TicketBookingForm(data)
            if not form.is_valid():
                return JsonResponse({"error": "Invalid form data", "details": form.errors}, status=400)
            requested_seats = form.cleaned_data['seats']
            if event.event_available_seats < requested_seats:
                return JsonResponse({"error": "Not enough seats available"}, status=400)
            total_price = requested_seats * event.event_price
            booking = form.save(commit=False)
            booking.user = UserProfile.objects.get(username=username)
            booking.event_id = id
            booking.booking_id = uuid.uuid4().hex[:12].upper()
            booking.price = total_price
            booking.booking_date=datetime.now().strftime("%a, %b %d, %Y, %#I:%M %p")
            booking.save()
            event.event_available_seats -= requested_seats
            event.save(update_fields=['event_available_seats'])
            booking_details = Bookingdetails.objects.filter(booking_id=booking.booking_id).values().first()
            eventSerializer=EventSerializer(event)
            Eventdata = eventSerializer.data 
            Eventdata["event_image"] = event.image_url
            TicketEmail(booking, event)
            response = {
                "events": Eventdata,
                "Addtocart": False,
                "EventId": str(id),
                "booking_details": booking_details,
                "emailaddress": emailaddress,
                "username": username,
                "seats": requested_seats,
                "message": "Booking successful"
            }
            return JsonResponse(response, safe=False)
        else:
            return JsonResponse({"error": "Method not allowed"}, status=405)
    except Exception as e:
        return JsonResponse({"error":{e}}, status=404)


def BookedConfrimation(request, id):
    try:
        booking = Bookingdetails.objects.get(booking_id=id)
        event = Events.objects.get(event_id=booking.event_id)
        eventSerializer=EventSerializer(event)
        Eventdata = eventSerializer.data 
        bookingSerializer=BookingdetailsSerializer(booking)
        booking_data = bookingSerializer.data
        response = {
            "event": Eventdata,
            "booking_details": booking_data
            }
        return JsonResponse(response)
    except Exception as e:
        return JsonResponse({"error": {e}}, status=404)


def Login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            Email = data.get("email")
            password = data.get("password")
            next_url = data.get("next", "/")
            user = UserProfile.objects.filter(email=Email).first()
            if user and user.password == Hashpassword(password):
                request.session['login_timestamp'] = timezone.now().strftime("%Y-%m-%d %H:%M")
                request.session['username'] = user.username
                request.session['email'] = Email
                request.session['is_admin'] = user.is_admin
                return JsonResponse({
                    "success": True,
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "is_admin": user.is_admin,
                    },
                    "next": next_url,
                })
            else:
                return JsonResponse({"success": False, "error": "Invalid email or password"}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse({"success": False, "error": "Invalid request method"}, status=405)

def SignUp(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            form = SignupForm(data)
            if form.is_valid():
                UserForm = form.save(commit=False)
                UserForm.password = Hashpassword(form.cleaned_data['password'])
                UserForm.save()
                request.session['user_id'] = UserForm.id
                request.session['username'] = UserForm.username
                request.session['signup_timestamp'] = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
                return JsonResponse({
                "success": True,
                "user": {
                    "id": UserForm.id,
                    "username": UserForm.username,
                    "email": UserForm.email,
                }
            }, status=201)
            else:
                return JsonResponse({"success": False, "errors": form.errors}, status=400)
        else:
            form = SignupForm()
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse({"success": False, "error": "Invalid request method"}, status=405)


def Hashpassword(password):
    import hashlib
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    return hashed_password

def Logout(request):
    if request.method == "POST":
        request.session.flush()
        return JsonResponse({"success": True, "message": "Logged out successfully"})
    else:
        return JsonResponse({"success": False, "error": "Invalid request method"}, status=405)

def google_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            id_token_value = data.get("id_token")
            next_url = data.get("next", "/")
            if not id_token_value:
                return JsonResponse({"success": False, "error": "ID token is required"}, status=400)
            try:
                idinfo = id_token.verify_oauth2_token(id_token_value, requests.Request(), settings.GOOGLE_CLIENT_ID)
                google_id = idinfo['sub']
                email = idinfo.get('email')
                name = idinfo.get('name', email.split('@')[0]) 
            except ValueError as e:
                return JsonResponse({"success": False, "error": "Invalid ID token"}, status=400)

            user = UserProfile.objects.filter(google_id=google_id).first()
            if not user:
                user = UserProfile.objects.filter(email=email).first()
                if user:
                    user.google_id = google_id
                    user.profile_image=idinfo.get("picture")
                    user.save()
                else:
                    user=UserProfile.objects.create(
                        username=name,      
                        email=email,
                        google_id=google_id,
                        profile_image=idinfo.get("picture")
                    )
            request.session['login_timestamp'] = timezone.now().strftime("%Y-%m-%d %H:%M")
            request.session['username'] = user.username
            request.session['email'] = user.email
            request.session['is_admin'] = user.is_admin

            return JsonResponse({
                "success": True,
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "is_admin": user.is_admin,
                    "profile": user.profile_image,
                },
                "next": next_url,
            })
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse({"success": False, "error": "Invalid request method"}, status=405)

def get_user(request):
    username = request.session.get('username')
    if username:
        email = request.session.get('email')
        is_admin = request.session.get('is_admin')
        return JsonResponse({
            "username": username,
            "email": email,
            "is_admin": is_admin
        })
    else:
        return JsonResponse({"error": "Not authenticated"}, status=401)
    
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def filter_events(request):
    try:
        data = json.loads(request.body)
        filters = data.get("filters", [])
        sort_by= data.get("sort_by", "")
        qs = Events.objects.all()
        date_query = Q()
        if 1 in filters:   
            date_query |= Q(event_scheduled_date__date=date.today())
        if 2 in filters:   
            date_query |= Q(event_scheduled_date__date=date.today() + timedelta(days=1))
        if date_query:
            qs = qs.filter(date_query)
        if 3 in filters:   
            qs = qs.filter(event_distance__lte=10)
        serializer=EventSerializer(qs,many=True)
        data = serializer.data 
        for i, event in enumerate(qs):
            data[i]["event_image"] = event.image_url
        return JsonResponse(data, safe=False)
    except Exception as e:
            return JsonResponse({"error": {e}}, status=404)

def Profile(request):
    try:
        emailaddress = request.session.get('email', '')
        userDetails = UserProfile.objects.filter(email=emailaddress).first()
        user_data = model_to_dict(userDetails)
        bookings=Bookingdetails.objects.filter(email=emailaddress)
        bookingSerializer=BookingdetailsSerializer(bookings,many=True)
        booking_list = bookingSerializer.data
    except Exception as e:
        return JsonResponse({"error": {e}}, status=404)
    return JsonResponse({ 'bookings': booking_list,'user': user_data}, safe=False)
