from rest_framework import serializers
from .models import Events,Artists,Bookingdetails,UserProfile


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model=  Events
        fields=["event_id",
            "event_title",
            "event_scheduled_date",
            "event_description",
            "event_available_seats",
            "event_total_seats",
            "event_price",
            "event_location",
            "is_sold_out",
            "event_image",
            "location_name",
            "latitude",
            "longitude",
            "event_category"]
        

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model= Artists
        fields=["artistid",
            "artistname",
            "description",
            "artist_image"]
        
class BookingdetailsSerializer(serializers.ModelSerializer):
    event = serializers.SerializerMethodField()
    class Meta:
        model= Bookingdetails
        fields="__all__"

    def get_event(self, obj):
        event = Events.objects.filter(event_id=obj.event_id).first()
        if not event:
            return None
        return EventSerializer(event).data

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields="__all__"
        
