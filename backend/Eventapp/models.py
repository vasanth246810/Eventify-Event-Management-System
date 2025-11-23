from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class UserProfile(models.Model):
    username = models.CharField(max_length=150, unique=True)  
    created_on= models.DateTimeField(default=timezone.now, blank=True)
    email= models.EmailField(max_length=254, blank=True)
    password = models.CharField(max_length=128) 
    is_admin = models.BooleanField(default=False)
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)  # Added google_id field

    def __str__(self):
        return self.username
    class Meta:
        db_table = 'eventbookingapp_userprofile'

class Events(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_title = models.CharField(max_length=100, blank=True, null=True)
    event_scheduled_date = models.DateTimeField(blank=True, null=True)
    event_description = models.CharField(max_length=200, blank=True, null=True)
    event_available_seats = models.IntegerField(blank=True, null=True)
    event_total_seats = models.IntegerField(blank=True, null=True)
    event_price = models.IntegerField(blank=True, null=True)
    event_location = models.CharField(max_length=200, blank=True, null=True)
    # event_image = models.ImageField(upload_to='event_images/', blank=True, null=True)
    is_sold_out = models.BooleanField(default=False)

    class Meta: 
        
        managed = False
        db_table = 'eventbookingapp_events'

    @property
    def booked_seats(self):
        return Bookingdetails.objects.filter(event_id=self.event_id).aggregate(
            total=models.Sum('seats')
        )['total'] or 0
    
    
        
class Bookingdetails(models.Model):
    user_id = models.ForeignKey(UserProfile, on_delete=models.CASCADE, db_column='User_id', primary_key=True)  # Changed to ForeignKey
    username = models.CharField(db_column='UserName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=100, blank=True, null=True)  # Field name made lowercase.
    seats = models.IntegerField(db_column='Seats', blank=True, null=True)
    event_id = models.IntegerField(db_column='Event_id', blank=True, null=True)
    booking_id = models.CharField(db_column='Booking_Id',max_length=100, blank=True, null=True,unique=True)  # Field name made lowercase.
    price = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'eventbookingapp_bookingdetails'
