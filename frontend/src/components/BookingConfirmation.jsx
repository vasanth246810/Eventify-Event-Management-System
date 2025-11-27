import  { useEffect, useState } from "react";
import axios from "axios";
import "../components/Styles/BookingConfirmation.css";
import { useParams } from "react-router-dom";
import {QRCodeSVG }  from "qrcode.react";

function BookingConfirmation(){
const{id}=useParams();
const[events_info,setEvents]=useState(null);
const[loading, setLoading] = useState(true);
const[error, setError] = useState(null);
const [currentDate, setCurrentDate] = useState(getDate());
console.log("Current Date:", currentDate);
const[booking_details,setBookingDetails]=useState({
    booking_id: '',
    email: '',
    seats: '',
    price: ''
});
function getDate(){
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

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




const options = {
  weekday: "short",   
  day: "2-digit",     
  month: "short",     
  year: "numeric",    
  hour: "numeric",   
  minute: "2-digit",  
  hour12: true        
};

const formattedDate = new Date().toLocaleString("en-US", options) || "";

const bookingurl=`${window.location.origin}/BookedConfrimation/${booking_details.booking_id}?qrscan=true`;

if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!events_info) return <div>No data available</div>;

return(
    <div className="bookconfirm-container">
      <div className="bookconfirm-header">
        <div className="bookconfirm-date text-light">{currentDate}</div>
        <div className="bookconfirm-title text-light">Booking Confirmation</div>
        <div className="bookconfirm-phone text-light">022 6144 5050</div>
      </div>

      <div className="bookconfirm-logo">
        <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="8" width="12" height="20" fill="#e31e24" rx="2" />
          <rect x="20" y="5" width="8" height="26" fill="#e31e24" rx="2" />
          <rect x="20" y="14" width="15" height="8" fill="#e31e24" />
          <rect x="38" y="8" width="12" height="20" fill="#e31e24" rx="2" />
          <path d="M43 8 L55 28" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="bookconfirm-content">
        <div className="bookconfirm-thankyou">
          <div className="bookconfirm-check"></div>
          <div className="bookconfirm-thankyou-text">Thank you for your purchase!</div>
        </div>

        <div className="bookconfirm-card">
          <div className="bookconfirm-qr">
            <QRCodeSVG value={bookingurl} size={150} className="qr-img"  style={{marginBottom:"5px"}}/>
            <div className="bookconfirm-id-label text-light">BOOKING ID</div>
            <div className="bookconfirm-id">{booking_details.booking_id}</div>
          </div>

          <div className="bookconfirm-movie-title">{events_info.event_title} (3D) (U/A)</div>

          <div className="bookconfirm-movie-details">
            <div className="text-light">
              <strong className="text-light">PVR:</strong> Sangam, Delhi (AUDI 1), National
            </div>
            <div className="text-light">Capital Region (NCR), Delhi</div>
            <div className="text-light">7:40pm | Tue, 12 Apr, 2016</div>
            <div className="text-light">
              <strong className="text-light">Quantity:</strong> {booking_details.seats} Tickets
            </div>
          </div>

          <div className="bookconfirm-quantity">
            <svg className="bookconfirm-seat-icon text-light" viewBox="0 0 20 16" fill="currentColor">
              <path d="M2 4h16v8H2V4zm0 0V2a1 1 0 011-1h14a1 1 0 011 1v2M4 12v2h12v-2" />
            </svg>
            <div className="bookconfirm-seat-info">
              <span className="bookconfirm-seat-type">NORMAL-J2,J3</span>
              <br />
              <span className="text-light" style={{ color: 'white' }}>AUDI 1</span>
            </div>
          </div>

          <div className="bookconfirm-amount-section">
            <div className="bookconfirm-amount-icon">₹</div>
            <div className="bookconfirm-amount-label text-light">AMOUNT PAID</div>
            <div className="bookconfirm-amount">Rs.{booking_details.price}</div>
          </div>
        </div>

        <div className="bookconfirm-buttons">
          <button className="bookconfirm-btn">INVITE FRIENDS</button>
          <button className="bookconfirm-btn">PRINT BOOKING INFO</button>
          <button className="bookconfirm-btn">DOWNLOAD E-TICKET</button>
        </div>

        <div className="bookconfirm-details">
          <div className="bookconfirm-section-title">BOOKING DATE & TIME</div>
          <div className="bookconfirm-section-content">{formattedDate}</div>

          <div className="bookconfirm-section-title">PAYMENT METHOD</div>
          <div className="bookconfirm-section-content">Credit Card/Debit Card</div>
        </div>

        <div className="bookconfirm-promo">
          <div className="bookconfirm-promo-icon">b</div>
          <div className="bookconfirm-promo-text">
            Get 2 Free Movie Tickets every month with{' '}
            <span className="bookconfirm-promo-highlight">BookMyShow RBL Bank Fun+ Credit Card</span>
            <br />
            <strong>Now!</strong>
            <span className="bookconfirm-instant-approval">INSTANT APPROVAL</span>
          </div>
        </div>
      </div>
    </div>

);
}




export default BookingConfirmation;