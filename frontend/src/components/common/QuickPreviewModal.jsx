import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export default function QuickPreviewModal({ isOpen, onClose, event }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

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

  const isSoldOut =
    event.is_sold_out ||
    (event.event_available_seats !== undefined && event.event_available_seats <= 0);

  const availableSeats = event.event_available_seats ?? 50;
  const totalCapacity = 100;
  const bookedPercent = Math.min(
    100,
    Math.max(10, Math.round(((totalCapacity - availableSeats) / totalCapacity) * 100))
  );

  return createPortal(
    <div
      className="framer-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div
        className="framer-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="framer-modal-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          ✕
        </button>

        <div className="framer-modal-grid">
          {/* Visual Banner Container */}
          <div className="framer-modal-visual">
            <img
              src={event.event_image}
              alt={event.event_title}
              className="framer-modal-img"
            />
            <div className="framer-modal-overlay"></div>
            <div className="framer-modal-floating-badge">
              {isSoldOut ? "🔴 Sold Out" : "⚡ Live Experience"}
            </div>
            <div className="framer-modal-price-pill">
              ₹{event.event_price}
            </div>
          </div>

          {/* Content Body */}
          <div className="framer-modal-content">
            <div className="framer-modal-header">
              <span className="framer-tag-pill">Curated Experience</span>
              <h2 id="preview-title" className="framer-modal-title">
                {event.event_title}
              </h2>
            </div>

            {/* Quick Metadata Chips */}
            <div className="framer-meta-chips">
              <div className="framer-meta-chip">
                <i className="far fa-calendar-alt me-2 text-danger"></i>
                <span>{formattedDate} • {formattedTime}</span>
              </div>
              <div className="framer-meta-chip">
                <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                <span>{event.event_location || "Central Arena, City Center"}</span>
              </div>
            </div>

            {/* Description Snippet */}
            <p className="framer-modal-desc">
              {event.event_description ||
                "Immerse yourself in an unforgettable evening of world-class entertainment, stellar acoustics, and electric atmosphere. Reserve your spot before phases sell out."}
            </p>

            {/* Seats Availability Bar */}
            <div className="framer-seats-container">
              <div className="framer-seats-header">
                <span className="text-secondary small">
                  {isSoldOut
                    ? "Tickets completely booked"
                    : `${availableSeats} seats remaining`}
                </span>
                <span className="text-white small fw-bold">{bookedPercent}% booked</span>
              </div>
              <div className="framer-progress-track">
                <div
                  className="framer-progress-fill"
                  style={{
                    width: `${bookedPercent}%`,
                    backgroundColor: isSoldOut ? "#ef4444" : "#ff2c55",
                  }}
                ></div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="framer-modal-actions">
              <Link
                to={`/events/${event.event_id}/buy-page`}
                className={`framer-btn-primary ${isSoldOut ? "disabled" : ""}`}
                style={{ textDecoration: "none" }}
              >
                {isSoldOut ? "Event Sold Out" : "Book Tickets Now →"}
              </Link>
              <Link
                to={`/event-list/${event.event_id}`}
                className="framer-btn-secondary"
                style={{ textDecoration: "none" }}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
