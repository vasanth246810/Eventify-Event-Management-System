from django.urls import path
from . import views

urlpatterns = [
    path("events/", views.events),
    path("artists/", views.artists),
    path("artists/<str:artistname>/", views.artist_detail),
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
    path('profile/', views.Profile),
    path('admin/bookings',views.BookingDetails),
    path('admin/users',views.UsersDetails),
    path('admin/users/<int:user_id>',views.UsersDetails),
    path('admin/analytics', views.admin_analytics),
    path('admin/CreateEvent', views.CreateEvent),
    path('admin/CreateEvent/<int:event_id>/', views.CreateEvent),
    path('admin/DeleteEvent/<int:event_id>/', views.DeleteEvent),
    path("whoami/", views.whoami,name="whoami"),
    # path("BookedConfrimation/<int:id>", views.BookedConfrimation),
]
