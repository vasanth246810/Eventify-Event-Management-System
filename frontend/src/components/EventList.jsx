import { useState, useEffect } from "react";
import eventImage from "./assests/Event.jpg";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./EventList.css";
import { useParams } from "react-router-dom";
import PopupGfg from './Popup';

export default function EventList() {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/event-list/${id}`);
                const eventData = Array.isArray(response.data) ? response.data[0] : response.data;
                setEvent(eventData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const user = sessionStorage.getItem("username");

      const handleBookTickets = () => {
        setPopupOpen(true);
    };

    if (loading) return <div className="text-center mt-5">Loading event details...</div>;
    if (error) return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    if (!event) return <div className="text-center mt-5">No event found</div>;

    return (
        <div>
            <div className="event-detail-container">
                <div className="event-image">
                    <img src={eventImage} alt={event.event_title || "Event"} />
                </div>
                <div className="event-info rounded">
                    <h1 className="event-title">{event.event_title}</h1>
                    <div className="event-categories">
                        Music, Concerts
                    </div>
                    <div className="event-meta">
                        <i className="bi bi-calendar-event"></i>
                        {event.event_scheduled_date ? new Date(event.event_scheduled_date).toLocaleString() : 'Date TBD'}
                    </div>
                    <div className="event-meta">
                        <i className="bi bi-geo-alt"></i>
                        Venue Location
                    </div>
                    <div className="price-book-row">
                        <div className="event-price">
                            Starts from ₹{event.event_price || 'Free'}
                        </div>
                        {user ?(
                        <a href={`/BookingTickets/${event.event_id}`} className="btn-book" style={{backgroundColor: "#000", color: "#fff"}}>
                            Book Tickets
                        </a>
                        ):(
                         <>
                                <button
                                    className="btn-book efewf"
                                    style={{ backgroundColor: "#000", color: "#fff" }}
                                    onClick={handleBookTickets}  // 🔹 opens popup
                                >
                                    Book Tickets
                                </button>

                                {/* 🔹 PopupGfg triggered here */}
                                <PopupGfg isPopupOpen={isPopupOpen} onClose={() => setPopupOpen(false)} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="about-event">
                <h2>About the Event</h2>
                <p>{event.event_description || 'No description available.'}</p>
            </div>

            <div className="artist-section">
                <h2>Performing Artists</h2>
                <div className="artist-grid">
                    <div className="artist-item">
                        <div className="artist-photo">
                            <img src={eventImage} alt="Artist 1"/>
                        </div>
                        <div className="artist-info">
                            <div className="artist-name">John Doe</div>
                            <div className="artist-role">Lead Singer</div>
                        </div>
                    </div>
                    <div className="artist-item">
                        <div className="artist-photo">
                            <img src={eventImage} alt="Artist 2"/>
                        </div>
                        <div className="artist-info">
                            <div className="artist-name">Jane Smith</div>
                            <div className="artist-role">Guitarist</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="venue-section">
                <h2>Venue Information</h2>
                <div className="venue-content" style={{border: "1px solid #ddd", borderRadius: "8px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "15px"}}>
                    <div className="venue-address" style={{flex: "1", margin: "0"}}>
                        Venue Address
                    </div>
                    <a href="https://www.google.com/maps" 
                       target="_blank" 
                       className="btn-book" 
                       style={{margin: "0", whiteSpace: "nowrap", backgroundColor: "#000", color: "#fff"}}>
                        Get Direction
                    </a>
                </div>
            </div>

            <div className="terms-section">
                <h2>Terms and Conditions</h2>
                <div className="terms-content">
                    <p>By booking tickets for this event, you agree to the following terms and conditions:</p>
                    <ul>
                        <li><strong>Booking Confirmation:</strong> All bookings are subject to availability and confirmation.</li>
                        <li><strong>Payment:</strong> Full payment must be made at the time of booking.</li>
                        <li><strong>Cancellation Policy:</strong> Please check the cancellation policy before booking.</li>
                        <li><strong>Entry Requirements:</strong> Valid ID proof is required for entry.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}