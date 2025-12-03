from django.contrib import admin
from .models import Events, UserProfile
# Register your models here.

# @admin.register(Events)
# class ImageAdmin(admin.ModelAdmin):
#     list_display = ("event_title", "event_image")

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_admin", "created_on")


@admin.register(Events)
class EventsAdmin(admin.ModelAdmin):
    list_display = (
        "event_id",
        "event_title",
        "event_scheduled_date",
        "event_location",
        "event_available_seats",
        "event_price",
        "is_sold_out"
    )
    list_filter = ("is_sold_out", "event_scheduled_date")
    search_fields = ("event_title", "event_location", "location_name")
    readonly_fields = ("event_id",)
