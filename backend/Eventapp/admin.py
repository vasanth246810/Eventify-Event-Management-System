from django.contrib import admin
from .models import Events, UserProfile
# Register your models here.

# @admin.register(Events)
# class ImageAdmin(admin.ModelAdmin):
#     list_display = ("event_title", "event_image")

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_admin", "created_on")
