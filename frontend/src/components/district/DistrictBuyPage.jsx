import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './DistrictBuyPage.css';

// Default Rahman Tiers
const DEFAULT_PRICE_FILTERS = [
  { price: 2499, section: 'Bronze', label: '₹2499' },
  { price: 3999, section: 'Silver', label: '₹3999' },
  { price: 5499, section: 'Gold', label: '₹5499' },
  { price: 7999, section: 'Platinum', label: '₹7999' },
  { price: 11999, section: 'Diamond', label: '₹11999' },
  { price: 35000, section: 'Standing Lounge', label: '₹35000' },
  { price: 38000, section: 'Solitaire', label: '₹38000' },
];

const DEFAULT_SECTION_DETAILS = {
  Bronze: {
    name: 'Phase 1 | Bronze',
    price: 2499,
    type: 'Standing',
    desc: 'Each ticket grants entry to one individual. Standing zone.',
    color: '#f8b69b',
  },
  Silver: {
    name: 'Phase 1 | Silver',
    price: 3999,
    type: 'Seated',
    desc: 'Each ticket grants entry to one individual. First-come, first-served seating.',
    color: '#9de8e3',
  },
  Gold: {
    name: 'Early Bird | Gold',
    price: 5499,
    type: 'Seated',
    desc: 'Each ticket grants entry to one individual. First-come, first-served seating.',
    color: '#f7cb8b',
  },
  Platinum: {
    name: 'Early Bird | Platinum',
    price: 7999,
    type: 'Seated',
    desc: 'Each ticket grants entry to one individual. First-come, first-served seating.',
    color: '#d6cbfe',
  },
  Diamond: {
    name: 'Early Bird | Diamond',
    price: 11999,
    type: 'Seated',
    desc: 'Each ticket grants entry to one individual. Assigned seated zone.',
    color: '#d0e2fc',
  },
  'Standing Lounge': {
    name: 'Standing Lounge',
    price: 35000,
    type: 'Lounge',
    desc: 'Elevated viewing platform. Inclusive of food and beverages.',
    color: '#e4a0f7',
  },
  Solitaire: {
    name: 'Phase 1 | Solitaire',
    price: 38000,
    type: 'Sofa seating',
    desc: 'Each ticket grants entry to two individuals. Assigned sofa seating.',
    color: '#f4cad2',
  },
};

export default function DistrictBuyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug, showId } = useParams();

  const isNumericId = slug && !isNaN(Number(slug));

  const [eventData, setEventData] = useState(null);
  const [eventTitle, setEventTitle] = useState('A R Rahman | Wonderment Tour Live in...');
  const [eventSubtitle, setEventSubtitle] = useState('Sat, 21 Nov | 7 PM • Gurugram');
  const [priceFilters, setPriceFilters] = useState(DEFAULT_PRICE_FILTERS);
  const [sectionDetails, setSectionDetails] = useState(DEFAULT_SECTION_DETAILS);

  const [svgContent, setSvgContent] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [ticketQty, setTicketQty] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const mapContainerRef = useRef(null);

  // Read movie booking state if routed from Movies Listing or Movie Detail
  useEffect(() => {
    if (location.state?.movieTitle) {
      setEventTitle(location.state.movieTitle);
      if (location.state.cinema && location.state.time) {
        setEventSubtitle(`${location.state.time} • ${location.state.cinema}`);
      }
    }
  }, [location.state]);

  // Fetch dynamic event info if slug is numeric
  useEffect(() => {
    if (isNumericId) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL || ''}/api/event-list/${slug}`)
        .then((res) => {
          const ev = res.data?.events?.[0];
          if (ev) {
            setEventData(ev);
            setEventTitle(ev.event_title);

            const d = new Date(ev.event_scheduled_date);
            const dateFormatted = !isNaN(d.getTime())
              ? `${d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} | ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
              : 'Upcoming';
            setEventSubtitle(`${dateFormatted} • ${ev.event_location || 'Central Arena'}`);

            const base = ev.event_price || 999;
            const prices = {
              Bronze: Math.round(base * 1.0),
              Silver: Math.round(base * 1.5),
              Gold: Math.round(base * 2.2),
              Platinum: Math.round(base * 3.5),
              Diamond: Math.round(base * 5.0),
              'Standing Lounge': Math.round(base * 8.0),
              Solitaire: Math.round(base * 10.0),
            };

            const filters = [
              { price: prices.Bronze, section: 'Bronze', label: `₹${prices.Bronze}` },
              { price: prices.Silver, section: 'Silver', label: `₹${prices.Silver}` },
              { price: prices.Gold, section: 'Gold', label: `₹${prices.Gold}` },
              { price: prices.Platinum, section: 'Platinum', label: `₹${prices.Platinum}` },
              { price: prices.Diamond, section: 'Diamond', label: `₹${prices.Diamond}` },
              { price: prices['Standing Lounge'], section: 'Standing Lounge', label: `₹${prices['Standing Lounge']}` },
              { price: prices.Solitaire, section: 'Solitaire', label: `₹${prices.Solitaire}` },
            ];
            setPriceFilters(filters);

            const details = {
              Bronze: {
                name: 'Phase 1 | Bronze',
                price: prices.Bronze,
                type: 'Standing',
                desc: 'Each ticket grants entry to one individual. Standing zone.',
                color: '#f8b69b',
              },
              Silver: {
                name: 'Phase 1 | Silver',
                price: prices.Silver,
                type: 'Seated',
                desc: 'Each ticket grants entry to one individual. First-come, first-served seating.',
                color: '#9de8e3',
              },
              Gold: {
                name: 'Early Bird | Gold',
                price: prices.Gold,
                type: 'Seated',
                desc: 'Each ticket grants entry to one individual. First-come, first-served seating.',
                color: '#f7cb8b',
              },
              Platinum: {
                name: 'Early Bird | Platinum',
                price: prices.Platinum,
                type: 'Seated',
                desc: 'Each ticket grants entry to one individual. First-come, first-served seating.',
                color: '#d6cbfe',
              },
              Diamond: {
                name: 'Early Bird | Diamond',
                price: prices.Diamond,
                type: 'Seated',
                desc: 'Each ticket grants entry to one individual. Assigned seated zone.',
                color: '#d0e2fc',
              },
              'Standing Lounge': {
                name: 'Standing Lounge',
                price: prices['Standing Lounge'],
                type: 'Lounge',
                desc: 'Elevated viewing platform. Inclusive of food and beverages.',
                color: '#e4a0f7',
              },
              Solitaire: {
                name: 'Phase 1 | Solitaire',
                price: prices.Solitaire,
                type: 'Sofa seating',
                desc: 'Each ticket grants entry to two individuals. Assigned sofa seating.',
                color: '#f4cad2',
              },
            };
            setSectionDetails(details);
          }
        })
        .catch((err) => {
          console.error('Error fetching event details for buy-page:', err);
        });
    }
  }, [slug, isNumericId]);

  // Fetch the exact District seatmap SVG from public directory
  useEffect(() => {
    fetch('/district_seatmap.svg')
      .then((res) => res.text())
      .then((text) => {
        // Strip xml declaration if present for clean inline rendering
        const cleanSvg = text.replace(/<\?xml.*?\?>/i, '').trim();
        setSvgContent(cleanSvg);
      })
      .catch((err) => console.error('Failed to load seatmap SVG:', err));
  }, []);

  // Update SVG section highlighting when activeFilter or selectedSection changes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const svgEl = mapContainerRef.current.querySelector('svg');
    if (!svgEl) return;

    const sections = svgEl.querySelectorAll('.section-seatmap');
    sections.forEach((sec) => {
      const dataId = sec.getAttribute('data-id');

      if (!activeFilter && !selectedSection) {
        sec.classList.remove('is-dimmed');
        sec.classList.remove('is-highlighted');
      } else {
        const matchesFilter = activeFilter && activeFilter.section === dataId;
        const matchesSelection = selectedSection && selectedSection === dataId;

        if (matchesFilter || matchesSelection) {
          sec.classList.add('is-highlighted');
          sec.classList.remove('is-dimmed');
        } else {
          sec.classList.add('is-dimmed');
          sec.classList.remove('is-highlighted');
        }
      }
    });
  }, [activeFilter, selectedSection, svgContent]);

  // Handle click on SVG sections
  const handleMapClick = (e) => {
    let target = e.target;
    while (target && target !== mapContainerRef.current) {
      if (
        target.classList &&
        target.classList.contains('section-seatmap') &&
        target.getAttribute('data-id')
      ) {
        const dataId = target.getAttribute('data-id');
        if (sectionDetails[dataId]) {
          setSelectedSection(dataId);
          setTicketQty(1);
          return;
        }
      }
      target = target.parentNode;
    }
  };

  const handleFilterClick = (filter) => {
    if (activeFilter && activeFilter.price === filter.price) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
      setSelectedSection(filter.section);
      setTicketQty(1);
    }
  };

  const handleZoom = (delta) => {
    setZoomLevel((prev) => {
      const next = prev + delta;
      return Math.min(Math.max(next, 0.7), 1.8);
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const currentDetails = selectedSection ? sectionDetails[selectedSection] : null;

  const handleCheckoutAction = async () => {
    if (selectedSection === 'Diamond' || selectedSection === 'Solitaire') {
      navigate(
        `/events/${slug || 'a-r-rahman-wonderment-tour-live-in-concert-delhi-2026'}/buy-page/shows/${showId || '6a9daea2f46f18fdd7f7edf6'}/${selectedSection}`
      );
      return;
    }

    const username = sessionStorage.getItem('username');
    const emailaddress = sessionStorage.getItem('emailaddress');

    if (!username) {
      navigate(`/Login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }

    const eventId = isNumericId ? slug : (eventData?.event_id || 18);
    setBookingLoading(true);

    try {
      const csrfRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || ''}/api/get-csrf-token/`,
        { withCredentials: true }
      );
      const csrfToken = csrfRes.data.csrfToken;

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || ''}/api/BookingTickets/${eventId}`,
        {
          username,
          email: emailaddress,
          seats: ticketQty,
        },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data?.booking_details?.booking_id) {
        sessionStorage.setItem(
          'selectedSeatDetails',
          JSON.stringify({
            tier: selectedSection,
            quantity: ticketQty,
            sectionType: currentDetails?.type || 'General Admission',
          })
        );
        navigate(`/BookedConfrimation/${res.data.booking_details.booking_id}`);
      } else {
        navigate(`/BookingTickets/${eventId}`);
      }
    } catch (err) {
      console.error('Booking failed, navigating to standard checkout:', err);
      navigate(`/BookingTickets/${eventId}`);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="district-page-root" role="main">
      {/* Top Header */}
      <header className="district-top-header" role="banner">
        {/* Left: District by Zomato Logo */}
        <Link to="/home" className="district-brand-link" title="District by Zomato">
          <span className="district-brand-title">district</span>
          <span className="district-brand-sub">by zomato</span>
        </Link>

        {/* Center: Event Info */}
        <div className="district-header-center">
          <Link
            to={isNumericId ? `/event-list/${slug}` : `/events/${slug || 'a-r-rahman-wonderment-tour-live-in-concert-delhi-2026'}`}
            className="district-header-event-title"
          >
            {eventTitle}
          </Link>
          <span className="district-header-event-subtitle">
            {eventSubtitle}
          </span>
        </div>

        {/* Right: Profile Avatar */}
        <div className="district-header-right">
          <button
            type="button"
            className="district-user-avatar"
            aria-label="User account"
            onClick={() => navigate('/profile')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </header>

      {/* Center Viewport: Interactive SVG Seat Map */}
      <main className="district-seatmap-viewport">
        <div
          ref={mapContainerRef}
          className="district-seatmap-container"
          style={{ transform: `scale(${zoomLevel})` }}
          onClick={handleMapClick}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />

        {/* Seatmap Legend */}
        <div className="district-seatmap-legend" aria-label="Seatmap legend">
          <div className="district-legend-item">
            <span className="district-legend-icon">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <circle cx="6" cy="3" r="2.5" fill="currentColor" />
                <path d="M2 13V8C2 6.89543 2.89543 6 4 6H8C9.10457 6 10 6.89543 10 8V13" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <span>Standing sections</span>
          </div>
          <div className="district-legend-item">
            <span className="district-legend-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 2V8H11V2M3 8V12M11 8V12M1 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>Seated sections</span>
          </div>
        </div>
      </main>

      {/* Floating Zoom Controls (Right) */}
      <aside className="district-floating-controls" aria-label="Map controls">
        <button
          type="button"
          className="district-zoom-btn"
          onClick={() => handleZoom(0.2)}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          type="button"
          className="district-zoom-btn"
          onClick={() => handleZoom(-0.2)}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button
          type="button"
          className="district-zoom-btn"
          onClick={handleResetZoom}
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </aside>

      {/* Bottom Sticky Filter Bar */}
      <footer className="district-bottom-filter-bar" role="contentinfo">
        <div className="district-filter-bar-content">
          <div className="district-filter-label">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"></line>
              <line x1="7" y1="12" x2="17" y2="12"></line>
              <line x1="10" y1="18" x2="14" y2="18"></line>
            </svg>
            <span>Filter stands by</span>
          </div>

          <div className="district-price-pills">
            {priceFilters.map((f) => {
              const isActive = activeFilter && activeFilter.price === f.price;
              return (
                <button
                  key={`${f.section}-${f.price}`}
                  type="button"
                  className={`district-price-pill ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleFilterClick(f)}
                  aria-pressed={isActive}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* Stand Selection Drawer / Modal */}
      {selectedSection && currentDetails && (
        <div
          className="district-drawer-backdrop"
          onClick={() => setSelectedSection(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="district-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="district-drawer-header">
              <div className="district-drawer-title-group">
                <h3 className="district-drawer-title">{currentDetails.name}</h3>
                <span className="district-drawer-subtitle">{currentDetails.type} zone</span>
              </div>
              <button
                type="button"
                className="district-drawer-close"
                onClick={() => setSelectedSection(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="district-drawer-card">
              <div className="district-drawer-card-info">
                <span className="district-drawer-card-name">{currentDetails.name}</span>
                <span className="district-drawer-card-desc">{currentDetails.desc}</span>
                <span className="district-drawer-card-price">
                  ₹{currentDetails.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="district-drawer-qty-control">
                <button
                  type="button"
                  className="district-qty-btn"
                  onClick={() => setTicketQty((q) => Math.max(1, q - 1))}
                  disabled={ticketQty <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="district-qty-val">{ticketQty}</span>
                <button
                  type="button"
                  className="district-qty-btn"
                  onClick={() => setTicketQty((q) => Math.min(10, q + 1))}
                  disabled={ticketQty >= 10}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="district-drawer-footer">
              <div className="district-drawer-total">
                ₹{(currentDetails.price * ticketQty).toLocaleString('en-IN')}
              </div>
              <button
                type="button"
                className="district-drawer-checkout-btn"
                disabled={bookingLoading}
                onClick={handleCheckoutAction}
              >
                {bookingLoading
                  ? 'Confirming Booking...'
                  : selectedSection === 'Diamond' || selectedSection === 'Solitaire'
                  ? 'Select Seats'
                  : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
