import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  MapPin,
  User,
  Ticket,
  Printer,
  Share2,
  CalendarPlus,
  Check,
  Copy,
  ArrowLeft
} from "lucide-react";
import "../components/Styles/BookingConfirmation.css";

export default function BookingConfirmation() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [seatDetails, setSeatDetails] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("selectedSeatDetails");
      if (stored) {
        setSeatDetails(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/BookedConfrimation/${id}`
        );
        setData(response.data);
      } catch (err) {
        console.error("Error loading booking confirmation:", err);
        setError(err.response?.data?.error || err.message || "Failed to load booking.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  // Extract and normalize data
  const event = data?.event || data || {};
  const booking = data?.booking_details || {};

  const bookingId = booking.booking_id || id || "EV-PENDING";
  const eventTitle = event.event_title || "Live Performance & Festival";
  const eventCategory = event.event_category || "Music & Concert";
  const eventLocation = event.event_location || event.location_name || "Main Arena, Delhi NCR";
  const attendeeName = booking.username || sessionStorage.getItem("username") || "Guest Attendee";
  const seats = booking.seats || 1;
  const price = booking.price || event.event_price || 0;

  // Format Show Date
  const rawDate = event.event_scheduled_date || booking.booking_date;
  let formattedDate = "Coming Soon";
  let formattedTime = "8:00 PM";
  let calendarStartDate = "";
  let calendarEndDate = "";

  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      formattedTime = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

      // Google Calendar ISO format: YYYYMMDDTHHmmssZ
      const pad = (n) => String(n).padStart(2, "0");
      const startIso = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
      const endD = new Date(d.getTime() + 3 * 60 * 60 * 1000); // +3 hours
      const endIso = `${endD.getUTCFullYear()}${pad(endD.getUTCMonth() + 1)}${pad(endD.getUTCDate())}T${pad(endD.getUTCHours())}${pad(endD.getUTCMinutes())}00Z`;
      calendarStartDate = startIso;
      calendarEndDate = endIso;
    }
  }

  // QR Code Payload (Verifiable URL for door scanning)
  const qrUrl = `${window.location.origin}/BookedConfrimation/${bookingId}?qrscan=true`;

  // Copy Booking ID
  const handleCopyId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Google Calendar Link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle + " (Eventify Pass)"
  )}&dates=${calendarStartDate || "20261024T180000Z"}/${calendarEndDate || "20261024T210000Z"}&details=${encodeURIComponent(
    `Eventify Digital Pass\nBooking ID: ${bookingId}\nSeats: ${seats}\nVenue: ${eventLocation}`
  )}&location=${encodeURIComponent(eventLocation)}`;

  // Share Ticket
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Eventify Ticket: ${eventTitle}`,
          text: `I'm attending ${eventTitle}! Booking ID: ${bookingId}`,
          url: window.location.href
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Ticket link copied to clipboard!");
    }
  };

  // Print Ticket
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="vip-pass-page d-flex items-center justify-content-center">
        <div className="text-center py-5">
          <div
            className="spinner-border text-danger mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading Ticket...</span>
          </div>
          <p className="text-neutral-400 font-mono text-sm">Generating Digital VIP Pass...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="vip-pass-page d-flex items-center justify-content-center">
        <div className="vip-pass-card text-center p-5">
          <h2 className="text-white font-bold mb-2">Booking Not Found</h2>
          <p className="text-neutral-400 text-sm mb-4">
            {error || "Unable to retrieve details for this booking pass."}
          </p>
          <Link to="/events" className="vip-action-primary text-decoration-none">
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vip-pass-page">
      {/* Top Success Notification Pill */}
      <div className="vip-success-pill">
        <span className="vip-success-dot"></span>
        <span>Payment Verified • Booking Confirmed</span>
      </div>

      <h1 className="vip-page-title">You're Going to the Show!</h1>
      <p className="vip-page-desc">
        Your digital admission pass is ready. Present this pass or QR code at the venue gate for instant check-in.
      </p>

      {/* ====================================================================
          THE DIGITAL VIP PASS (APPLE WALLET / FESTIVAL ENTRY CARD)
          ==================================================================== */}
      <div className="vip-pass-card" id="digital-ticket-pass">
        {/* Pass Header */}
        <div className="vip-card-header">
          <div className="vip-brand-lockup">
            <div className="vip-brand-badge">
              <svg viewBox="0 0 32 32" fill="none" width="20" height="20">
                <circle cx="16" cy="18" r="10" stroke="#ffffff" strokeWidth="2.2" />
                <path d="M 8 16 C 8 8, 24 8, 24 16" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 12 7 C 10 3.5, 18 3.5, 20 6" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="13" cy="18" r="1.3" fill="#ffffff" />
                <circle cx="19" cy="18" r="1.3" fill="#ffffff" />
              </svg>
            </div>
            <svg viewBox="0 0 172 26" fill="none" height="16" style={{ width: "auto" }}>
              <path d="M 2 3 H 20 L 11 13 L 20 23 H 2 L 8 13 Z" fill="#ff2c55" />
              <path d="M 24 3 L 34 23 H 42 L 32 3 Z" fill="#ffffff" />
              <rect x="46" y="3" width="18" height="5" rx="1" fill="#ffffff" />
              <rect x="46" y="10.5" width="18" height="5" rx="1" fill="#ffffff" />
              <rect x="46" y="18" width="18" height="5" rx="1" fill="#ffffff" />
              <path d="M 68 23 V 3 H 74 L 84 17 V 3 H 89 V 23 H 83 L 73 9 V 23 Z" fill="#ffffff" />
              <path d="M 93 3 H 111 V 8 H 105 V 23 H 99 V 8 H 93 Z" fill="#ffffff" />
              <rect x="115" y="3" width="6" height="20" rx="1" fill="#ffffff" />
              <path d="M 125 3 H 141 V 8 H 131 V 11 H 139 V 16 H 131 V 23 H 125 Z" fill="#ffffff" />
              <path d="M 145 3 L 153 13 V 23 H 159 V 13 L 167 3 H 160 L 156 9 L 152 3 Z" fill="#ffffff" />
            </svg>
          </div>

          <span className="vip-tier-badge">VIP Admission</span>
        </div>

        {/* Pass Body (Event Details) */}
        <div className="vip-card-body">
          <div className="vip-event-tag">{eventCategory}</div>
          <h2 className="vip-event-title">{eventTitle}</h2>

          {/* 2-Column Metadata Grid */}
          <div className="vip-grid">
            {/* Date & Time */}
            <div className="vip-grid-item">
              <span className="vip-label d-flex items-center gap-1">
                <Calendar size={12} className="text-danger" /> Date & Time
              </span>
              <span className="vip-value">{formattedDate}</span>
              <span className="text-xs text-neutral-400">{formattedTime}</span>
            </div>

            {/* Venue Location */}
            <div className="vip-grid-item">
              <span className="vip-label d-flex items-center gap-1">
                <MapPin size={12} className="text-danger" /> Venue Location
              </span>
              <span className="vip-value">{eventLocation}</span>
            </div>

            {/* Attendee */}
            <div className="vip-grid-item">
              <span className="vip-label d-flex items-center gap-1">
                <User size={12} className="text-danger" /> Attendee
              </span>
              <span className="vip-value">{attendeeName}</span>
            </div>

            {/* Quantity / Passes */}
            <div className="vip-grid-item">
              <span className="vip-label d-flex items-center gap-1">
                <Ticket size={12} className="text-danger" /> Admission Passes
              </span>
              <span className="vip-value highlight">
                {seats} {seats === 1 ? "Ticket" : "Tickets"}
                {seatDetails?.tier ? ` • ${seatDetails.tier}` : ""}
              </span>
            </div>

            {/* Assigned Seat Details if chosen from Seat Matrix */}
            {seatDetails?.row && (
              <div className="vip-grid-item">
                <span className="vip-label d-flex items-center gap-1">
                  <Ticket size={12} className="text-danger" /> Assigned Seat
                </span>
                <span className="vip-value highlight">
                  Row {seatDetails.row}, Seat {seatDetails.seat}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Perforated Tear Line with Authentic Ticket Cutouts */}
        <div className="vip-tear-wrapper" aria-hidden="true">
          <div className="vip-notch-left"></div>
          <div className="vip-tear-line"></div>
          <div className="vip-notch-right"></div>
        </div>

        {/* Lower Ticket Stub (QR Code & Gate Scan) */}
        <div className="vip-card-stub">
          {/* High-Contrast QR Code Card */}
          <div className="vip-qr-box">
            <QRCodeSVG
              value={qrUrl}
              size={144}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Booking ID with Copy Button */}
          <div className="vip-booking-id-group">
            <span className="vip-id-label">Booking ID:</span>
            <span className="vip-id-code">{bookingId}</span>
            <button
              onClick={handleCopyId}
              className="vip-copy-btn"
              title="Copy Booking ID"
              aria-label="Copy Booking ID"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
          </div>

          <p className="vip-stub-notice">
            Scan this QR code at the turnstile entrance for priority gate check-in.
          </p>

          {/* Amount Paid Bar */}
          <div className="vip-amount-bar">
            <div className="vip-amount-left">
              <div className="vip-amount-label">Total Amount Paid</div>
              <div className="vip-amount-val">₹{price}</div>
            </div>
            <div className="vip-amount-status">
              <Check size={13} />
              <span>Paid & Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          UTILITY ACTION CONTROLS
          ==================================================================== */}
      <div className="vip-actions-wrapper">
        {/* Primary: Print / Save PDF */}
        <button onClick={handlePrint} className="vip-action-primary">
          <Printer size={18} />
          <span>Print / Save Ticket as PDF</span>
        </button>

        {/* Secondary Actions: Calendar & Share */}
        <div className="vip-action-row">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="vip-action-secondary"
          >
            <CalendarPlus size={16} />
            <span>Add to Calendar</span>
          </a>

          <button onClick={handleShare} className="vip-action-secondary">
            <Share2 size={16} />
            <span>Share Pass</span>
          </button>
        </div>

        {/* Return to Explore */}
        <Link to="/events" className="vip-back-link">
          <ArrowLeft size={15} />
          <span>Browse More Events</span>
        </Link>
      </div>
    </div>
  );
}