import { useState, useEffect } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../components/Styles/EventList.css";
import { useParams, Link } from "react-router-dom";
import PopupGfg from './Popup';

export default function EventList() {
    const [event, setEvent] = useState(null);
    const [Artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/event-list/${id}`);
                const eventData = response.data.events?.length > 0 ? response.data.events[0] : null;
                const Artist=response.data.artists || [] ;
                setEvent(eventData);
                setArtists(Artist)
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
                    <img src={event.event_image} alt={event.event_title || "Event"} />
                </div>
                <div className="event-info rounded-2">
                    <h1 className="event-title">{event.event_title}</h1>
                    <div className="event-categories ">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5v14.586c0 .89 1.077 1.337 1.707.707L12 14l6.293 6.293c.63.63 1.707.184 1.707-.707V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2Z"/>
                    </svg> Music, Concerts
                    </div>
                    <div className="event-meta">
                        <i className="bi bi-calendar-event"></i>
                        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M19.5 4h-3V2.5a.5.5 0 0 0-1 0V4h-7V2.5a.5.5 0 0 0-1 0V4h-3A2.503 2.503 0 0 0 2 6.5v13A2.503 2.503 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-13A2.5 2.5 0 0 0 19.5 4M21 19.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5V11h18zm0-9.5H3V6.5C3 5.672 3.67 5 4.5 5h3v1.5a.5.5 0 0 0 1 0V5h7v1.5a.5.5 0 0 0 1 0V5h3A1.5 1.5 0 0 1 21 6.5z"/>
                        </svg>{event.event_scheduled_date ? new Date(event.event_scheduled_date).toLocaleString() : 'Date TBD'}
                    </div>
                    <div className="event-meta">
                        <i className="bi bi-geo-alt"></i>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-width="2" d="M12 22s-8-6-8-12c0-5 4-8 8-8s8 3 8 8c0 6-8 12-8 12Zm0-9a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/>
                        </svg>{event.location_name}
                    </div>
                    <hr style={{ borderTop: "2px solid #ff2c55", margin: 0,opacity:"1" }} />

                    <div className="price-book-row">
                        <div className="eventist-price">
                            Starts from ₹{event.event_price || 'Free'}
                        </div>
                        {user ?(
                        <a href={`/BookingTickets/${event.event_id}`} className="btn-book" style={{backgroundColor: "#000", color: "#fff"}}>
                            Book Tickets
                        </a>
                        ):(
                         <>
                                <button
                                    className="btn-book"
                                    style={{ backgroundColor: "#000", color: "#fff",textTransform:"uppercase" }}
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
                <p className="text-light">{event.event_description || 'No description available.'}</p>
            </div>

            <div className="artist-section">
                <h2>Performing Artists</h2>
                <div className="artist-grid">

                    {Artists.map((artist)=>( 
                      <Link key={artist.artistid} to={`/artists/${artist.artistname}`} style={{ textDecoration:"none", color:"inherit" }}>
                      <div className="artist-item">
                        <div className="artist-photo">
                            <img src={artist.artist_image} alt={artist.artistname}/>
                        </div>
                        <div className="artist-info">
                            <div className="artist-name">{artist.artistname}</div>
                            <div className="artist-role">Lead Singer</div>
                        </div>
                     </div>
                     </Link>
                     ))}
                   
                    {/* <div className="artist-item">
                        <div className="artist-photo">
                            <img src={eventImage} alt="Artist 2"/>
                        </div>
                        <div className="artist-info">
                            <div className="artist-name">Jane Smith</div>
                            <div className="artist-role">Guitarist</div>
                        </div>
                    </div> */}
                </div>
            </div>

            <div className="venue-section">
                <h2>Venue Information</h2>
                <div className="venue-content">
                    <div className="venue-address">
                       {event.location_name}
                    </div>
                    <a href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}` }
                       target="_blank" 
                       className="btn-book" 
                       style={{margin: "0", whiteSpace: "nowrap", backgroundColor: "#000", color: "#fff" ,border:"2px solid"}}>
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