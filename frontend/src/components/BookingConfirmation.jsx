import  { useEffect, useState } from "react";
import axios from "axios";
import "./BookingConfirmation.css";
import { useParams } from "react-router-dom";


function BookingConfirmation(){

const{id}=useParams();

const[events_info,setEvents]=useState(null);
const[loading, setLoading] = useState(true);
const[error, setError] = useState(null);
const[booking_details,setBookingDetails]=useState({
    booking_id: '',
    email: '',
    seats: '',
    price: ''
});
useEffect(()=>{
    const fetchdata=async()=>{
        try{
        const response=await axios.get(`http://localhost:8000/api/BookedConfrimation/${id}`);
        setEvents(response.data);
        setBookingDetails(response.data.booking_details);
        setLoading(false);
        }
        catch(error){
           console.error(error);
           setError(error.message);
           setLoading(false);
        }
    }
    fetchdata();
},[id]);

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!events_info) return <div>No data available</div>;

return(
<div className="confirmation-container">
    <div className="confirmation-header">
        <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#4CAF50" stroke-width="2"/>
                <path d="M8 12l2 2 4-4" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
        <h1>Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your event booking has been successfully processed</p>
    </div>

    <div className="confirmation-details">
        <div className="booking-summary">
            <h2>Booking Summary</h2>
            <div className="detail-row">
                <span className="label">Booking ID:</span>
                <span className="value booking-id">{ booking_details.booking_id }</span>
            </div>
            <div className="detail-row">
                <span className="label">Event Name:</span>
                <span className="value">{ events_info.event_title }</span>
            </div>
            <div className="detail-row">
                <span className="label">Date & Time:</span>
                <span className="value">{events_info.event_scheduled_date ? new Date(events_info.event_scheduled_date).toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : ''}</span>
            </div>
            <div className="detail-row">
                <span className="label">Number of Seats:</span>
                <span className="value">{ booking_details.seats }</span>
            </div>
            <div className="detail-row">
                <span className="label">Price per Seat:</span>
                <span className="value">${ events_info.event_price }</span>
            </div>
            <div className="detail-row total">
                <span className="label">Total Amount:</span>
                <span className="value">₹{ booking_details.price }</span>
            </div>
        </div>

        <div className="event-info">
            <h2>Event Details</h2>
            <div className="detail-row">
                <span className="label">Location:</span>
                <span className="value">{events_info.event_location || "To be announced"}</span>
            </div>
            <div className="detail-row">
                <span className="label">Description:</span>
                <span className="value">{ events_info.event_description }</span>
            </div>
        </div>
    </div>

    <div className="confirmation-actions">
        <div className="action-buttons">
            <a href={`/home`} className="btn btn-confrim">Back to Home</a>
            {/* <button onClick={window.print()} className="btn btn-outline">Print Confirmation</button> */}
        </div>
    </div>

    <div className="important-notes">
        <h3>Important Notes</h3>
        <ul>
            <li>Please save this booking confirmation for your records</li>
            <li>A confirmation email has been sent to { booking_details.email }</li>
            <li>Arrive at least 15 minutes before the event start time</li>
            <li>Bring a valid ID and this booking confirmation (digital or printed)</li>
            <li>For any queries, contact our support team</li>
        </ul>
    </div>
</div>

);
}




export default BookingConfirmation;