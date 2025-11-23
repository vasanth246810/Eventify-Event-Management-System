from django.urls import path
from . import views

urlpatterns = [
    path("", views.home),
    path("home/", views.home),
    path("about/", views.about),
    path("events/", views.events),
    path("contact/", views.contact),
    path("event-list/<int:id>", views.EventList),
    path("BookingTickets/<int:id>", views.BookingTickets),
    path("Login/", views.Login),
    path("SignUp/", views.SignUp),
    path("get-csrf-token/", views.get_csrf_token),
    path("Logout/", views.Logout),
    path("BookedConfrimation/<str:id>", views.BookedConfrimation),
    path("google_login/", views.google_login),
    path("get_user/", views.get_user),
    path('events/filter/', views.filter_events),
    # path("BookedConfrimation/<int:id>", views.BookedConfrimation),
]
