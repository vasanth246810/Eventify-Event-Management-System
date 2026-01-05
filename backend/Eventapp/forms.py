from django import forms
from .models import *

class SignupForm(forms.ModelForm):
    username = forms.CharField(max_length=150, required=True)
    email = forms.EmailField(max_length=100, required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'password')

class SigninForm(forms.Form):
    username = forms.CharField(max_length=150, required=True)
    password = forms.CharField(widget=forms.PasswordInput())


class TicketBookingForm(forms.ModelForm):
    username=forms.CharField(max_length=150)
    email=forms.EmailField(max_length=50)
    seats=forms.IntegerField()

    class Meta:
        model = Bookingdetails
        fields = ('username', 'email','seats')

class EventForm(forms.ModelForm):
    class Meta:
        model = Events
        fields = ('event_title', 'event_scheduled_date','event_description','event_total_seats','event_price','event_location','event_category','event_image')


class UserDetailsForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'userrole', 'password')