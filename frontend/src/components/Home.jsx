import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../components/Styles/FramerShowcase.css";
import "../components/Styles/Home.css";
import { EventSkeletonGrid } from "./common/EventSkeleton";
import QuickPreviewModal from "./common/QuickPreviewModal";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewEvent, setPreviewEvent] = useState(null);

  // Fetch Events and Artists
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, artistsRes] = await Promise.allSettled([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/artists/`),
        ]);

        if (eventsRes.status === "fulfilled") {
          setEvents(eventsRes.value.data || []);
        }
        if (artistsRes.status === "fulfilled") {
          setArtists(artistsRes.value.data || []);
        }
      } catch (error) {
        console.error("Error loading showcase data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const today = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_scheduled_date) >= today
  );
  const nextSpotlightEvent =
    upcomingEvents.length > 0
      ? [...upcomingEvents].sort(
          (a, b) =>
            new Date(a.event_scheduled_date) - new Date(b.event_scheduled_date)
        )[0]
      : events[0] || null;

  // Countdown Timer for Spotlight Event
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (nextSpotlightEvent && nextSpotlightEvent.event_scheduled_date) {
      const targetDate = new Date(
        nextSpotlightEvent.event_scheduled_date
      ).getTime();

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            ),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [nextSpotlightEvent]);

  // Categories
  const categories = [
    { label: "All Experiences", value: "All", icon: "✨" },
    { label: "Music & Concerts", value: "Music", icon: "🎵" },
    { label: "Comedy & Standup", value: "Comedy", icon: "🎭" },
    { label: "Tech & Summits", value: "Tech", icon: "💻" },
    { label: "Nightlife & Parties", value: "Night", icon: "🍸" },
    { label: "Sports & Fitness", value: "Sports", icon: "⚡" },
  ];

  // Filtering Logic
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.event_location &&
        event.event_location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      event.event_title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (event.event_description &&
        event.event_description
          .toLowerCase()
          .includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="framer-page-wrapper">
      {/* Hero Section */}
      <section className="framer-hero">
        {/* Floating Status Beacon */}
        <div className="framer-status-badge">
          <span className="framer-status-dot"></span>
          <span>Curating 500+ Extraordinary Experiences • 12 Cities</span>
        </div>

        {/* Display Typography */}
        <h1 className="framer-hero-title">
          Unforgettable Moments,<br className="d-none d-md-block" />{" "}
          <span className="framer-hero-title-highlight">Seamlessly Crafted</span>
        </h1>

        <p className="framer-hero-subtitle">
          Explore premier concerts, intimate acoustic sessions, comedy specials,
          and immersive festivals with instant atomic seat locking.
        </p>

        {/* Key Metrics Strip */}
        <div className="framer-stats-strip">
          <div className="framer-stat-pill">
            <span className="framer-stat-value">{events.length}+</span>
            <span className="framer-stat-label">Live Events</span>
          </div>
          <div className="framer-stat-pill">
            <span className="framer-stat-value">{artists.length}+</span>
            <span className="framer-stat-label">Verified Artists</span>
          </div>
          <div className="framer-stat-pill">
            <span className="framer-stat-value">50k+</span>
            <span className="framer-stat-label">Tickets Reserved</span>
          </div>
          <div className="framer-stat-pill">
            <span className="framer-stat-value">4.9★</span>
            <span className="framer-stat-label">Attendee Rating</span>
          </div>
        </div>

        {/* Floating Command Island */}
        <div className="framer-command-island">
          <div className="framer-search-row">
            <i className="fas fa-search framer-search-icon"></i>
            <input
              type="text"
              className="framer-search-input"
              placeholder="Search experiences, venues, cities or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="framer-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <span className="framer-search-counter">
              {filteredEvents.length} Available
            </span>
          </div>

          <div className="framer-filter-row">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`framer-category-pill ${
                  selectedCategory === cat.value ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Showcase Banner: A R Rahman Wonderment Tour */}
      <section className="container mb-5" style={{ maxWidth: '1200px' }}>
        <div
          style={{
            backgroundColor: '#0d0f17',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '24px 28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src="https://cdn.district.in/assets/events/publisher/event_cover_image_horizontal/01M3KVF87Q2JAQ35AFWHS7GS4Y.jpg"
              alt="A R Rahman Live in Concert"
              style={{
                width: '85px',
                height: '85px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.78rem',
                  color: '#ff2c55',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#ff2c55',
                  }}
                ></span>
                Featured District Event
              </div>
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: '1.4rem',
                  margin: '0 0 6px 0',
                  fontFamily: 'Anton, sans-serif',
                  letterSpacing: '0.02em',
                }}
              >
                A R Rahman | Wonderment Tour Live in Concert | Delhi
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Saturday, 21 Nov 2026 | 7:00 PM • Backyard Sports Club, Gurugram
              </p>
            </div>
          </div>

          <Link
            to="/events/a-r-rahman-wonderment-tour-live-in-concert-delhi-2026/buy-page/shows/6a9daea2f46f18fdd7f7edf6"
            style={{
              backgroundColor: '#ff2c55',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s ease',
            }}
          >
            <span>Book Tickets</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Bento Grid Showcase */}
      <section className="framer-bento-section">
        <div className="framer-section-heading">
          <div>
            <h2 className="framer-section-title">Curated Collections</h2>
            <p className="framer-section-subtitle">
              Handpicked spotlights and trending events this week
            </p>
          </div>
          <Link
            to="/events"
            className="framer-btn-secondary"
            style={{ textDecoration: "none" }}
          >
            Explore All Events →
          </Link>
        </div>

        <div className="framer-bento-grid">
          {/* Tile 1: Spotlight Event with Countdown (Span 7) */}
          {nextSpotlightEvent ? (
            <div className="framer-bento-tile framer-bento-spotlight">
              <div
                className="framer-spotlight-bg"
                style={{
                  backgroundImage: `url(${nextSpotlightEvent.event_image})`,
                }}
              ></div>
              <div className="framer-spotlight-overlay"></div>

              <div className="framer-spotlight-content">
                <span className="framer-status-badge mb-2">
                  <span className="framer-status-dot"></span> Next Headline Showcase
                </span>
                <h3
                  className="text-white fw-bold mb-2"
                  style={{ fontSize: "1.8rem" }}
                >
                  {nextSpotlightEvent.event_title}
                </h3>
                <p className="text-secondary small mb-0">
                  <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                  {nextSpotlightEvent.event_location || "Main Stadium Arena"} • Phase 1 Selling Fast
                </p>
              </div>

              <div className="framer-spotlight-content mt-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div className="framer-bento-countdown">
                    <div className="framer-countdown-box">
                      <div className="framer-countdown-num">{timeLeft.days}</div>
                      <div className="framer-countdown-unit">Days</div>
                    </div>
                    <div className="framer-countdown-box">
                      <div className="framer-countdown-num">{timeLeft.hours}</div>
                      <div className="framer-countdown-unit">Hrs</div>
                    </div>
                    <div className="framer-countdown-box">
                      <div className="framer-countdown-num">{timeLeft.minutes}</div>
                      <div className="framer-countdown-unit">Mins</div>
                    </div>
                    <div className="framer-countdown-box">
                      <div className="framer-countdown-num">{timeLeft.seconds}</div>
                      <div className="framer-countdown-unit">Secs</div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="framer-action-preview-btn py-2 px-3"
                      onClick={() => setPreviewEvent(nextSpotlightEvent)}
                    >
                      Quick Preview
                    </button>
                    <Link
                      to={`/BookingTickets/${nextSpotlightEvent.event_id}`}
                      className="framer-btn-primary py-2 px-3 text-white text-decoration-none"
                    >
                      Book Tickets →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="framer-bento-tile framer-bento-spotlight">
              <h3 className="text-white">New Experiences Arriving Soon</h3>
            </div>
          )}

          {/* Tile 2: Trending Categories (Span 5) */}
          <div className="framer-bento-tile framer-bento-categories">
            <div>
              <span className="framer-tag-pill">Trending Now</span>
              <h3 className="text-white fw-bold" style={{ fontSize: "1.4rem" }}>
                Browse by Mood
              </h3>
              <p className="text-secondary small">
                From high-energy festivals to cozy underground comedy clubs.
              </p>
            </div>

            <div className="framer-category-chips-grid">
              <div
                className="framer-bento-chip"
                onClick={() => setSelectedCategory("Music")}
              >
                <span>🎸 Rock & Indie</span>
              </div>
              <div
                className="framer-bento-chip"
                onClick={() => setSelectedCategory("Music")}
              >
                <span>🎧 EDM & Rave</span>
              </div>
              <div
                className="framer-bento-chip"
                onClick={() => setSelectedCategory("Comedy")}
              >
                <span>🎤 Stand-up Special</span>
              </div>
              <div
                className="framer-bento-chip"
                onClick={() => setSelectedCategory("Night")}
              >
                <span>🍸 Rooftop Nights</span>
              </div>
            </div>
          </div>

          {/* Tile 3: Verified Artist Community (Span 6) */}
          <div className="framer-bento-tile framer-bento-artists">
            <span className="framer-tag-pill">Global Talents</span>
            <h3 className="text-white fw-bold" style={{ fontSize: "1.4rem" }}>
              Headline Artists
            </h3>
            <p className="text-secondary small mb-3">
              Direct artist access with backstage passes & early fanpit access.
            </p>

            <div className="framer-artist-avatars-row">
              {artists.slice(0, 5).map((artist) => (
                <Link
                  key={artist.artistid || artist.artistname}
                  to={`/artists/${artist.artistname}`}
                  title={artist.artistname}
                >
                  <img
                    src={artist.artist_image}
                    alt={artist.artistname}
                    className="framer-artist-avatar"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Tile 4: VIP Perks & Security (Span 6) */}
          <div className="framer-bento-tile framer-bento-vip">
            <span className="framer-tag-pill">Guaranteed Authenticity</span>
            <h3 className="text-white fw-bold" style={{ fontSize: "1.4rem" }}>
              100% Verified Tickets
            </h3>
            <p className="text-secondary small mb-3">
              Tamper-proof digital passes with encrypted QR validation, instant
              wallet download, and real-time seat lock protection.
            </p>
            <div className="d-flex gap-3 text-secondary small">
              <span>✓ Instant QR Pass</span>
              <span>✓ Atomic Seat Locks</span>
              <span>✓ Zero Scalping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Event Gallery */}
      <section className="framer-gallery-section">
        <div className="framer-section-heading">
          <div>
            <h2 className="framer-section-title">Featured Experiences</h2>
            <p className="framer-section-subtitle">
              Showing {filteredEvents.length} hand-picked events
            </p>
          </div>
        </div>

        {loading ? (
          <EventSkeletonGrid count={8} />
        ) : filteredEvents.length > 0 ? (
          <div className="framer-cards-grid">
            {filteredEvents.map((event) => {
              const isSoldOut =
                event.is_sold_out ||
                (event.event_available_seats !== undefined &&
                  event.event_available_seats <= 0);
              const availableSeats = event.event_available_seats ?? 50;
              const bookedPercent = Math.min(
                100,
                Math.max(15, Math.round(((100 - availableSeats) / 100) * 100))
              );

              return (
                <div key={event.event_id} className="framer-event-card">
                  {/* Image Canvas with Hover Zoom */}
                  <div className="framer-card-canvas">
                    <img
                      src={event.event_image}
                      alt={event.event_title}
                      className="framer-card-image"
                      loading="lazy"
                    />
                    <div className="framer-card-overlay"></div>

                    {/* Floating Badges */}
                    <div
                      className={`framer-card-badge ${
                        isSoldOut ? "sold-out" : ""
                      }`}
                    >
                      {isSoldOut ? "Sold Out" : "⚡ Trending"}
                    </div>

                    <div className="framer-card-price">
                      ₹{event.event_price}
                    </div>

                    {/* Hover Action Buttons */}
                    <div className="framer-card-hover-actions">
                      <button
                        type="button"
                        className="framer-action-preview-btn"
                        onClick={() => setPreviewEvent(event)}
                      >
                        <i className="far fa-eye"></i> Quick Preview
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="framer-card-body">
                    <div>
                      <div className="framer-card-date">
                        <i className="far fa-calendar-alt"></i>
                        <span>
                          {new Date(
                            event.event_scheduled_date
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                          })}
                        </span>
                      </div>

                      <h4 className="framer-card-title">{event.event_title}</h4>

                      <div className="framer-card-location">
                        <i className="fas fa-map-marker-alt text-danger"></i>
                        <span>
                          {event.event_location || "City Center Auditorium"}
                        </span>
                      </div>
                    </div>

                    {/* Remaining Seats Meter */}
                    <div className="framer-card-seats-bar">
                      <div className="framer-card-seats-info">
                        <span>
                          {isSoldOut
                            ? "All tickets booked"
                            : `${availableSeats} seats remaining`}
                        </span>
                        <span className="fw-bold">{bookedPercent}%</span>
                      </div>
                      <div className="framer-mini-track">
                        <div
                          className="framer-mini-fill"
                          style={{
                            width: `${bookedPercent}%`,
                            backgroundColor: isSoldOut ? "#ef4444" : "#ff2c55",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5 text-secondary">
            <i className="fas fa-search fa-3x mb-3" style={{ opacity: 0.3 }}></i>
            <h4 className="text-white">No experiences match your filter</h4>
            <p>Try searching for different keywords or clear the category filter.</p>
            <button
              type="button"
              className="framer-btn-secondary mt-2"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Social Proof & Footer Strip */}
      <div
        className="py-5 text-center"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "#050608",
        }}
      >
        <div className="container">
          <p className="text-secondary small mb-3">
            Join 50,000+ experience seekers across the globe
          </p>
          <div className="d-flex justify-content-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-5"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-5"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-5"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-5"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Quick Preview Modal */}
      <QuickPreviewModal
        isOpen={Boolean(previewEvent)}
        onClose={() => setPreviewEvent(null)}
        event={previewEvent}
      />
    </div>
  );
}
