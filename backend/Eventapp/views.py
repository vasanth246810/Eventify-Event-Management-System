from django.utils import timezone
from datetime import *
import json
import uuid
from django.http import JsonResponse
from django.forms.models import model_to_dict
from Eventapp.models import *
from Eventapp.forms import *
from Eventapp.Email import TicketEmail
from django.middleware.csrf import get_token
from django.conf import settings
from urllib.parse import urljoin
def home(request):
    return JsonResponse({"page": "Home", "content": "Welcome to Home Page"})

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def about(request):
    return JsonResponse({"page": "About", "content": "This is the About Page"})

def events(request):
    try:
        events = list(Events.objects.values())
        for event in events:
            image_path = event.get('event_image')
            if image_path:
                event['event_image'] = request.build_absolute_uri('/media/' + image_path)
            else:
                event['event_image'] = None
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

