from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags

def TicketEmail(BookingForm, EventsInfo):
    try:
        subject = f"Your Booking Confirmation: {BookingForm.booking_id}"
        
        html_message = f"""
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: auto;">
            <h2 style="color: #4CAF50; text-align: center;">Booking Confirmed</h2>
            
            <p style="font-size: 16px;">Hello <strong>{BookingForm.username}</strong>,</p>

            <p>Your booking for the event <strong>"{EventsInfo.event_title}"</strong> has been <span style="color: green;"><strong>successfully confirmed</strong></span>.</p>

            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;">
                <p><strong>Booking ID:</strong> {BookingForm.booking_id}</p>
                <p><strong>Seats Booked:</strong> {BookingForm.seats}</p>
                <p><strong>Total Price:</strong> ₹{BookingForm.price}</p>
                <p><strong>Event Date:</strong> {EventsInfo.event_scheduled_date.strftime('%B %d, %Y • %I:%M %p')}</p>
            </div>

            <p style="margin-top: 20px;">Thank you for booking with us. We look forward to seeing you at the event!</p>

            <p>Best regards,<br><strong>Eventifyy</strong></p>
        </div>
        """

        plain_message = strip_tags(html_message)

        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [BookingForm.email],
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send ticket email: {str(e)}")
