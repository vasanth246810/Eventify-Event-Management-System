import axios from "axios";
import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookingTickets.css";

const API_BASE = "http://localhost:8000/api";

export default function BookingTickets(){
const[events,setEvents]=useState(null);
const[Addtocart,setAddtocart]=useState();
const[seats,setSeats]=useState(1);
const username = sessionStorage.getItem("username") || "";
const emailaddress = sessionStorage.getItem("emailaddress") || "";
const{id}=useParams();
const navigate = useNavigate();

useEffect(()=>{
    const fetchdata=async()=>{
        try{
        const response=await axios.get(`${API_BASE}/BookingTickets/${id}`, { withCredentials: true });
        setEvents(response.data.events[0]);
        setAddtocart(response.data.Addtocart);
        setSeats(response.data.seats || 1);

        }
        catch(error){
           console.error(error.response ? error.response.data : error.message);
        }
    }
    fetchdata();
},[id]);

if (!events) {
    return <div>Loading...</div>;
  }
const increaseSeats=()=>{
    setSeats(seats + 1);
}

const decreaseSeats=()=>{
    if (seats > 1) {
        setSeats(seats - 1);
}}

const TotalPrice=(seats * events.event_price + 334.18).toFixed(2);

const handleAddCart=async ()=>{
    try{
    const toggle=await axios.get(`${API_BASE}/BookingTickets/${id}`,{
        params:{
            toggle:1,
            seats:seats,

        },
        withCredentials: true,
    }
);
    setEvents(toggle.data.events[0]);
    setAddtocart(toggle.data.Addtocart);
    // setSeats(toggle.data.seats || 1);

}
catch(error){
    console.error(error);
}

};


const handleBooking=async (e)=>{
    e.preventDefault();
    try{
        const csrfResponse = await axios.get(`${API_BASE}/get-csrf-token/`, { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        const response = await axios.post(
            `${API_BASE}/BookingTickets/${id}`,
            {
                username: username,
                email: emailaddress,
                seats: seats,
            },
            {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );
        if (response.data && response.data.booking_details && response.data.booking_details.booking_id) {
            navigate(`/BookedConfrimation/${response.data.booking_details.booking_id}`);
        }
    } catch (error) {
        console.error(error);
    }
};
    return(
    <div className="containers">
         {Addtocart ? (
              <>
        <div className="ticket-item">
        <div className="ticket-info">
          <strong>{events.event_title} | {events.event_location}</strong>
          <p className="text-light">Phase 1 | Fanpit</p>
          <p className="text-light"><span id="ticket-count-text">{seats}</span>tickets</p>
        </div>
        <div className="ticket-quantity">
          <button type="button" id="decrease-btn" onClick={decreaseSeats}>-</button>
          <span id="ticket-count">{seats}</span>
          <button type="button" id="increase-btn" onClick={increaseSeats}>+</button>
        </div>
        <div className="price-details">
          <div>₹<span id="ticket-price">{events.event_price}</span></div>
        </div>
      </div>
        <button type="submit" className=" Addbtn border btn-primary"  onClick={handleAddCart}>ADD TO CART</button>
              </>
        ) : (
              <>
    <h2 className="text-light">Order Summary</h2>
        <form method="post" id="booking-form">
            <div className="ticket-item">
            <div className="ticket-info">
                <strong>{events.event_title} | {events.event_location}</strong>
                <p className="text-light">Phase 1 | Fanpit</p>
                <p className="text-light"><span id="ticket-count-text">{seats}</span> tickets</p>
            </div>
            <div className="ticket-quantity">
                <button type="button" id="decrease-btn"onClick={decreaseSeats}>-</button>
                <span id="ticket-count">{seats}</span>
                <button type="button" id="increase-btn"onClick={increaseSeats}>+</button>
            </div>
            <div className="price-details">
                <div>₹<span id="ticket-price">{events.event_price}</span></div>
                <input type="hidden" name="seats" id="seats" value={seats} />
            </div>
            <input type="hidden" name="EventId" value={events.event_id} />
            <input type="hidden" name="username" value={username} />
            <input type="hidden" name="email" value={emailaddress} />
            </div>
            <div className="offers text-light" tabIndex="0" onClick={() => alert('Show all event offers')}>
            View all event offers <i className="fas fa-chevron-right"></i>
            </div>
            <div className="payment-details">
            <div>
                <span className="text-light">Order Amount</span>
                <span className="text-light">₹<span id="order-amount">{seats * events.event_price}</span></span>
            </div>
            <div>
                <span className="text-light">Booking Fee</span>
                <span className="text-light">₹334.18</span>
            </div>
            <div className="total">
                <span className="text-light">Order Total</span>
                <span className="text-light">₹<span id="order-total">{TotalPrice}</span></span>
            </div>
            </div>
            <button type="submit" className=" Addbtn btn-primary" onClick={handleBooking}>CONTINUE</button>
        </form>
       </>
        )}
    </div>
    );
}
