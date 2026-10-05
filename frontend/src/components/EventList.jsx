import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import PopupGfg from "./Popup";
import "../components/Styles/EventList.css";

export default function EventList() {
  const [event, setEvent] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = sessionStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/event-list/${id}`
        );
        const eventData =
          response.data.events?.length > 0 ? response.data.events[0] : null;
        setEvent(eventData);
        setArtists(response.data.artists || []);

        // Load wishlist status
        const savedWishlist = JSON.parse(
          localStorage.getItem("eventify_wishlist") || "[]"
        );
        if (eventData && savedWishlist.includes(eventData.event_id)) {
          setIsWishlisted(true);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const toggleWishlist = () => {
    if (!event) return;
    const savedWishlist = JSON.parse(
      localStorage.getItem("eventify_wishlist") || "[]"
    );
    let updated;
    if (savedWishlist.includes(event.event_id)) {
      updated = savedWishlist.filter((eventId) => eventId !== event.event_id);
      setIsWishlisted(false);
    } else {
      updated = [...savedWishlist, event.event_id];
      setIsWishlisted(true);
    }
    localStorage.setItem("eventify_wishlist", JSON.stringify(updated));
  };

  const goToLogin = () => {
    navigate(`/Login?next=${encodeURIComponent(location.pathname)}`, { state: { from: location } });
  };

  const handleBookTickets = () => {
    if (!user) {
      setPopupOpen(true);
    } else {
      navigate(`/events/${event.event_id}/buy-page`);
    }
  };

  if (loading) {
    return (
      <div className="district-page-wrapper">
        <div className="district-container">
          <Skeleton
            variant="text"
            width="50%"
            height={50}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={28}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", mb: 4 }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={380}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", borderRadius: "16px", mb: 4 }}
          />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="district-page-wrapper text-center py-5">
        <div className="district-container py-5">
          <h2 className="text-white mb-3">Event Not Found</h2>
          <p className="text-secondary mb-4">
            {error || "The requested event could not be found or has concluded."}
          </p>
          <Link to="/events" className="btn btn-danger rounded-pill px-4 py-2">
            Explore All Events
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut =
    event.is_sold_out ||
    (event.event_available_seats !== undefined &&
      event.event_available_seats <= 0);
  const availableSeats = event.event_available_seats ?? 50;
  const bookedPercent = Math.min(
    100,
    Math.max(15, Math.round(((100 - availableSeats) / 100) * 100))
  );

  const eventDate = new Date(event.event_scheduled_date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="district-page-wrapper">
      <div className="district-container">
        {/* Event Header: Title & Date (District Style - Above Banner) */}
        <div className="district-header">
          <h1 className="district-title">{event.event_title}</h1>
          <p className="district-date-badge">
            <i className="far fa-calendar-alt"></i>
            <span>
              {formattedDate}, {formattedTime}
            </span>
          </p>
        </div>

        {/* Hero Banner Showcase (District Style) */}
        <div className="district-banner-wrapper">
          <img
            src={event.event_image}
            alt={event.event_title}
            className="district-banner-img"
          />
        </div>

        {/* Main Split Layout */}
        <div className="district-main-layout">
          {/* Left Column Content */}
          <div className="district-left-content">
            {/* About Section */}
            <div>
              <h2 className="district-section-title">About</h2>
              <p className="district-about-text">
                {event.event_description
                  ? readMore
                    ? event.event_description
                    : `${event.event_description.slice(0, 240)}...`
                  : "Join us for an unforgettable live experience packed with world-class entertainment, stellar acoustic staging, and electric vibes. Book early to secure the best seats."}
              </p>
              {event.event_description &&
                event.event_description.length > 240 && (
                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 mt-2 text-decoration-none fw-semibold"
                    onClick={() => setReadMore(!readMore)}
                  >
                    {readMore ? "Read less ∧" : "Read more ∨"}
                  </button>
                )}
            </div>

            {/* Highlights (District Style Cards) */}
            <div>
              <h2 className="district-section-title">Highlights</h2>
              <div className="district-highlights-grid">
                <div className="district-highlight-card">
                  <div className="district-highlight-header">
                    <span>👑</span>
                    <span>Why this event stands out</span>
                  </div>
                  <p className="district-highlight-desc">
                    Experience state-of-the-art concert sound staging, immersive visual lighting, and intimate artist interaction.
                  </p>
                </div>
                <div className="district-highlight-card">
                  <div className="district-highlight-header">
                    <span>✨</span>
                    <span>What you'll experience</span>
                  </div>
                  <p className="district-highlight-desc">
                    Live chart-topping setlists, electrifying crowd energy, exclusive merchandise stalls, and food & drinks zone.
                  </p>
                </div>
              </div>
            </div>

            {/* Performing Artists Lineup */}
            {artists && artists.length > 0 && (
              <div>
                <h2 className="district-section-title">Performing Artists</h2>
                <div className="district-artists-row">
                  {artists.map((artist) => (
                    <Link
                      key={artist.artistid || artist.artistname}
                      to={`/artists/${artist.artistname}`}
                      className="district-artist-item"
                    >
                      <img
                        src={artist.artist_image}
                        alt={artist.artistname}
                        className="district-artist-photo"
                      />
                      <span className="district-artist-name">
                        {artist.artistname}
                      </span>
                      <span className="district-artist-role">Lead Artist</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Venue & Location */}
            <div>
              <h2 className="district-section-title">Venue Information</h2>
              <div className="district-venue-card">
                <div className="district-venue-info">
                  <div className="district-venue-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <div className="district-venue-name">
                      {event.location_name || event.event_location || "Central Arena"}
                    </div>
                    <div className="district-venue-sub">
                      Main Concert Complex • Gates open 1 hour prior
                    </div>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps?q=${
                    event.latitude && event.longitude
                      ? `${event.latitude},${event.longitude}`
                      : encodeURIComponent(
                          event.location_name || event.event_location || "Stadium Arena"
                        )
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="district-btn-directions"
                >
                  Get Direction
                </a>
              </div>
            </div>

            {/* Things to Know (District Bullet Points) */}
            <div>
              <h2 className="district-section-title">Things to know</h2>
              <ul className="district-things-list">
                <li>
                  <span className="district-bullet-dot"></span>
                  <span>Entry allowed for all ages</span>
                </li>
                <li>
                  <span className="district-bullet-dot"></span>
                  <span>Valid government photo ID required at the gate</span>
                </li>
                <li>
                  <span className="district-bullet-dot"></span>
                  <span>Tickets required for all attendees ages 3 and above</span>
                </li>
                <li>
                  <span className="district-bullet-dot"></span>
                  <span>Outdoor and indoor zones with seated and standing pit</span>
                </li>
                <li>
                  <span className="district-bullet-dot"></span>
                  <span>Professional recording gear and outside food/beverages are prohibited</span>
                </li>
              </ul>
            </div>

            {/* More / Accordion (District Style) */}
            <div>
              <h2 className="district-section-title">More</h2>
              <div
                className="district-accordion-item"
                onClick={() => setShowFaq(!showFaq)}
              >
                <div className="district-accordion-title">
                  <i className="far fa-question-circle text-danger"></i>
                  <span>Frequently asked questions</span>
                </div>
                <i className={`fas fa-chevron-${showFaq ? "up" : "right"} text-secondary`}></i>
              </div>
              {showFaq && (
                <div className="p-3 text-secondary small bg-dark rounded-3 mb-2">
                  <p><strong>When will gates open?</strong> Gates open 60 minutes before the scheduled start time.</p>
                  <p><strong>Is re-entry allowed?</strong> Re-entry is strictly not permitted once wristbands are scanned.</p>
                  <p className="mb-0"><strong>Is parking available?</strong> Venue parking is available on a first-come, first-served basis.</p>
                </div>
              )}

              <div
                className="district-accordion-item"
                onClick={() => setShowTerms(!showTerms)}
              >
                <div className="district-accordion-title">
                  <i className="far fa-file-alt text-danger"></i>
                  <span>Terms and Conditions</span>
                </div>
                <i className={`fas fa-chevron-${showTerms ? "up" : "right"} text-secondary`}></i>
              </div>
              {showTerms && (
                <div className="p-3 text-secondary small bg-dark rounded-3">
                  <p>All bookings are final and non-refundable.</p>
                  <p>Event schedule and artist lineup are subject to change due to weather or technical requirements.</p>
                  <p className="mb-0">Organizers reserve the right to refuse admission for disorderly conduct.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky District Booking Card */}
          <aside className="district-sticky-card">
            {/* Top Row: Price + Book Tickets Button */}
            <div className="district-card-top-row">
              <div>
                <h3 className="district-card-price-title">
                  ₹{event.event_price || "Free"}
                </h3>
                <span className="district-card-price-sub">onwards</span>
              </div>

              {isSoldOut ? (
                <button className="district-book-btn disabled" disabled>
                  Sold Out
                </button>
              ) : (
                <button
                  type="button"
                  className="district-book-btn"
                  onClick={handleBookTickets}
                >
                  Book tickets
                </button>
              )}
            </div>

            {/* Venue Row */}
            <a
              href={`https://www.google.com/maps?q=${
                event.latitude && event.longitude
                  ? `${event.latitude},${event.longitude}`
                  : encodeURIComponent(
                      event.location_name || event.event_location || "Stadium Arena"
                    )
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="district-card-item-row"
            >
              <div className="district-card-item-left">
                <div className="district-card-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4 className="district-card-item-title">
                    {event.location_name || event.event_location || "Central Arena"}
                  </h4>
                  <p className="district-card-item-sub">City Center, Main Gate</p>
                </div>
              </div>
              <i className="fas fa-chevron-right district-card-chevron"></i>
            </a>

            {/* Timing Row */}
            <div className="district-card-item-row">
              <div className="district-card-item-left">
                <div className="district-card-icon">
                  <i className="far fa-clock"></i>
                </div>
                <div>
                  <h4 className="district-card-item-title">
                    Gates open at {formattedTime}
                  </h4>
                  <p className="district-card-item-sub">
                    View full schedule & timeline
                  </p>
                </div>
              </div>
              <i className="fas fa-chevron-right district-card-chevron"></i>
            </div>

            {/* Seat Availability Progress Bar */}
            <div className="district-seats-meter-row">
              <div className="district-seats-meter-header">
                <span>
                  {isSoldOut
                    ? "Tickets completely booked"
                    : `${availableSeats} seats remaining`}
                </span>
                <span className="fw-bold text-white">{bookedPercent}% booked</span>
              </div>
              <div className="district-meter-track">
                <div
                  className="district-meter-fill"
                  style={{
                    width: `${bookedPercent}%`,
                    backgroundColor: isSoldOut ? "#ef4444" : "#ff2c55",
                  }}
                ></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Action Side Pill (District Style) */}
      <div className="district-floating-actions">
        <button
          type="button"
          className={`district-float-btn ${isWishlisted ? "active" : ""}`}
          onClick={toggleWishlist}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist"
        >
          <i className={`${isWishlisted ? "fas" : "far"} fa-heart`}></i>
        </button>
        <button
          type="button"
          className="district-float-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: event.event_title,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Event link copied to clipboard!");
            }
          }}
          title="Share event"
          aria-label="Share"
        >
          <i className="fas fa-share-alt"></i>
        </button>
      </div>

      {/* Login Required Modal (Rendered in full screen center above the page) */}
      <PopupGfg
        isPopupOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
        onGoLogin={goToLogin}
      />
    </div>
  );
}