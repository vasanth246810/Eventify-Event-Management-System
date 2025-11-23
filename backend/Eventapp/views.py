from django.utils import timezone
from datetime import *
import json,redis
import uuid
from django.http import JsonResponse
from django.forms.models import model_to_dict
from Eventapp.models import *
from Eventapp.forms import *
from Eventapp.Email import TicketEmail
from django.middleware.csrf import get_token
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
# from urllib.parse import urljoin
from django.db.models import Q

def home():
    return JsonResponse({"page": "Home", "content": "Welcome to Home Page"})

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def about(request):
    return JsonResponse({"page": "About", "content": "This is the About Page"})

def events(request):
    try:
        events = list(Events.objects.values())
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse(events, safe=False)

def contact(request):
    return JsonResponse({"page": "Contact", "content": "Contact us at support@example.com"})

def EventList(request,id):
    # id =request.GET.get('event_id')
    try:
        events = list(Events.objects.filter(event_id=id).values())
        for event in events:
            image_path = event.get('event_image')
            if image_path:
                event['event_image'] = request.build_absolute_uri('/media/' + image_path)
            else:
                event['event_image'] = None
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse(events, safe=False)

def BookingTickets(request, id):
    try:
        event = Events.objects.get(event_id=id)
    except Events.DoesNotExist:
        return JsonResponse({"error": "Event not found"}, status=404)
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
        events_list = [model_to_dict(event)]
        response = {
            "events": events_list,
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
        booking.event_id = id
        booking.booking_id = uuid.uuid4().hex[:12].upper()
        booking.price = total_price
        booking.save()
        # Update event seats
        event.event_available_seats -= requested_seats
        event.save(update_fields=['event_available_seats'])

        # Send booking confirmation email
        TicketEmail(booking, event)

        # Get booking details as dict
        booking_details = Bookingdetails.objects.filter(booking_id=booking.booking_id).values().first()
        events_list = [model_to_dict(event)]
        response = {
            "events": events_list,
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

def BookedConfrimation(request, id):
    try:
        booking = Bookingdetails.objects.get(booking_id=id)
        event = Events.objects.get(event_id=booking.event_id)
        response = {
            "event_title": event.event_title,
            "event_scheduled_date": event.event_scheduled_date,
            "event_location": event.event_location,
            "event_description": event.event_description,
            "event_price": event.event_price,
            "booking_details": {
                "booking_id": booking.booking_id,
                "email": booking.email,
                "seats": booking.seats,
                "price": booking.price
            }
        }
        return JsonResponse(response)
    except Bookingdetails.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)
    except Events.DoesNotExist:
        return JsonResponse({"error": "Event not found"}, status=404)


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
            # try:
            #     idinfo = id_token.verify_oauth2_token(id_token_value, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
                google_id = idinfo['sub']
                email = idinfo.get('email')
                name = idinfo.get('name', email.split('@')[0])  # Use name or email prefix as username
            except ValueError as e:
                return JsonResponse({"success": False, "error": "Invalid ID token"}, status=400)

            # Check if user exists with this google_id
            user = UserProfile.objects.filter(google_id=google_id).first()
            if not user:
                # Check if user exists with this email
                user = UserProfile.objects.filter(email=email).first()
                if user:
                    # Link Google account to existing user
                    user.google_id = google_id
                    user.save()
                else:
                    return JsonResponse({"success": False, "error": "user does not exist"}, status=400)

            # Set session
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
    data = json.loads(request.body)
    filters = data.get("filters", [])

    qs = Events.objects.all()

    date_query = Q()

    # OR logic for dates
    if 1 in filters:   # Today
        date_query |= Q(event_scheduled_date__date=date.today())

    if 2 in filters:   # Tomorrow
        date_query |= Q(event_scheduled_date__date=date.today() + timedelta(days=1))

    if date_query:
        qs = qs.filter(date_query)

    # AND logic for distance
    if 3 in filters:   # Under 10 KM
        qs = qs.filter(event_distance__lte=10)

    return JsonResponse(list(qs.values()), safe=False)