import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './DistrictSeatPicker.css';

// 4 Blocks Layout matching District's Diamond seating plan
// Total 15 rows (8 upper stepped rows + 7 lower rectangular rows)
const ROW_NAMES = ['DB', 'DC', 'DD', 'DE', 'DF', 'DG', 'DH', 'DM', 'DN', 'DO', 'DP', 'DQ', 'DR', 'DS', 'DT'];

export default function DistrictSeatPicker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug, showId, itemGroupName } = useParams();

  const categoryName = itemGroupName || 'Diamond';
  const isNumericId = slug && !isNaN(Number(slug));

  const [eventData, setEventData] = useState(null);
  const [eventTitle, setEventTitle] = useState('A R Rahman | Wonderment Tour Live in...');
  const [eventSubtitle, setEventSubtitle] = useState('Sat, 21 Nov | 7 PM • Gurugram');
  const [seatPrice, setSeatPrice] = useState(categoryName === 'Solitaire' ? 38000 : 11999);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Track selected seat (null initially to match "Select your seats")
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Dynamic event fetch
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
            let price = Math.round(base * 5.0);
            if (categoryName.toLowerCase().includes('solitaire')) {
              price = Math.round(base * 10.0);
            } else if (categoryName.toLowerCase().includes('platinum')) {
              price = Math.round(base * 3.5);
            } else if (categoryName.toLowerCase().includes('gold')) {
              price = Math.round(base * 2.2);
            } else if (categoryName.toLowerCase().includes('silver')) {
              price = Math.round(base * 1.5);
            } else if (categoryName.toLowerCase().includes('bronze')) {
              price = Math.round(base * 1.0);
            }
            setSeatPrice(price);
          }
        })
        .catch((err) => {
          console.error('Error fetching event details for seat picker:', err);
        });
    }
  }, [slug, isNumericId, categoryName]);

  const handleSeatClick = (blockId, rowName, colIdx, isBooked) => {
    if (isBooked) return;
    const seatId = `${rowName}-${colIdx}`;
    if (selectedSeat && selectedSeat.id === seatId) {
      setSelectedSeat(null);
    } else {
      setSelectedSeat({
        row: rowName,
        number: colIdx,
        id: seatId,
        blockId,
      });
      setBookingError('');
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSeat) return;

    const username = sessionStorage.getItem('username');
    const emailaddress = sessionStorage.getItem('emailaddress');

    if (!username) {
      navigate(`/Login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }

    const eventId = isNumericId ? slug : (eventData?.event_id || 18);
    setBookingLoading(true);
    setBookingError('');

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
          seats: 1,
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
            tier: categoryName,
            row: selectedSeat.row,
            seat: selectedSeat.number,
            block: selectedSeat.blockId,
            seatId: selectedSeat.id,
            price: seatPrice,
          })
        );
        navigate(`/BookedConfrimation/${res.data.booking_details.booking_id}`);
      } else {
        navigate(`/BookingTickets/${eventId}`);
      }
    } catch (err) {
      console.error('Booking failed from seat picker:', err);
      if (err.response?.data?.error) {
        setBookingError(err.response.data.error);
      } else {
        navigate(`/BookingTickets/${eventId}`);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Helper to render a seat row across the 4 blocks
  const renderRow = (rowName, rIdx) => {
    const isUpper = rIdx < 8; // Top section with diagonal steps

    // Block 1 (Far-Left): 12 columns
    const b1Cols = isUpper ? 12 : (rIdx < 11 ? 9 : 0);
    // Block 2 (Center-Left): 22 columns
    const b2Cols = isUpper ? Math.min(22, 6 + rIdx * 2) : 22;
    // Block 3 (Center-Right): 22 columns
    const b3Cols = isUpper ? Math.min(22, 6 + rIdx * 2) : 22;
    // Block 4 (Far-Right): 12 columns
    const b4Cols = isUpper ? 12 : 9;

    const renderDots = (count, blockId, startCol, alignRight = false) => {
      const dots = [];
      const totalWidth = blockId === 1 || blockId === 4 ? 12 : 22;
      const emptyCount = totalWidth - count;

      for (let i = 0; i < totalWidth; i++) {
        let isPresent = false;
        let colNumber = startCol + i;

        if (alignRight) {
          isPresent = i >= emptyCount;
        } else {
          isPresent = i < count;
        }

        if (!isPresent) {
          dots.push(<div key={`empty-${blockId}-${i}`} className="seat-dot-placeholder" />);
          continue;
        }

        const isSelected =
          selectedSeat &&
          selectedSeat.row === rowName &&
          selectedSeat.number === colNumber;

        // Gray vs Blue seats pattern matching District's availability
        const isBooked =
          !isSelected &&
          (rIdx < 3 || (blockId === 4 && i > 4) || (blockId === 1 && i < 4) || (rIdx > 11 && i % 4 === 0));

        dots.push(
          <div key={`${blockId}-${colNumber}`} className="seat-dot-wrapper">
            <button
              type="button"
              className={`seat-dot ${isSelected ? 'selected' : isBooked ? 'booked' : 'available'}`}
              onClick={() => handleSeatClick(blockId, rowName, colNumber, isBooked)}
              disabled={isBooked}
              aria-label={`Row ${rowName}, Seat ${colNumber} - ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
            >
              {isSelected && <span className="seat-check-icon">✓</span>}
            </button>

            {/* Floating Tooltip Card over the Selected Seat */}
            {isSelected && (
              <div className="seat-tooltip-popup" role="tooltip">
                <div className="seat-tooltip-top">
                  <div className="seat-tooltip-col">
                    <span className="seat-tooltip-label">Row</span>
                    <span className="seat-tooltip-val">{rowName}</span>
                  </div>
                  <div className="seat-tooltip-col">
                    <span className="seat-tooltip-label">Seat</span>
                    <span className="seat-tooltip-val">{colNumber}</span>
                  </div>
                </div>
                <div className="seat-tooltip-bottom">
                  <div className="seat-tooltip-status">
                    <span>✓</span>
                    <span>Selected</span>
                  </div>
                  <div className="seat-tooltip-price">₹{seatPrice.toLocaleString('en-IN')}</div>
                </div>
              </div>
            )}
          </div>
        );
      }
      return dots;
    };

    return (
      <div key={rowName} className="seat-matrix-row">
        {/* Block 1 */}
        <div className="seat-quad-block block-1">{renderDots(b1Cols, 1, 1, false)}</div>

        {/* Block 2 */}
        <div className="seat-quad-block block-2">{renderDots(b2Cols, 2, 20, true)}</div>

        {/* Block 3 */}
        <div className="seat-quad-block block-3">{renderDots(b3Cols, 3, 50, false)}</div>

        {/* Block 4 */}
        <div className="seat-quad-block block-4">{renderDots(b4Cols, 4, 80, true)}</div>
      </div>
    );
  };

  const backLink = isNumericId
    ? `/events/${slug}/buy-page`
    : `/events/${slug || 'a-r-rahman-wonderment-tour-live-in-concert-delhi-2026'}/buy-page/shows/${showId || '6a9daea2f46f18fdd7f7edf6'}`;

  return (
    <div className="seat-picker-page" role="main">
      {/* Top Header */}
      <header className="seat-picker-header" role="banner">
        <Link to="/home" className="seat-picker-brand" title="District by Zomato">
          <span className="seat-picker-brand-title">district</span>
          <span className="seat-picker-brand-sub">by zomato</span>
        </Link>

        <div className="seat-picker-header-center">
          <Link to={backLink} className="seat-picker-event-title">
            {eventTitle}
          </Link>
          <span className="seat-picker-event-meta">
            {eventSubtitle}
          </span>
        </div>

        <button
          type="button"
          className="district-user-avatar"
          onClick={() => navigate('/profile')}
          aria-label="User account"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </header>

      {bookingError && (
        <div className="alert alert-danger mx-auto mt-2 text-center" style={{ maxWidth: '600px', zIndex: 100 }}>
          {bookingError}
        </div>
      )}

      {/* Main Seat Canvas */}
      <main className="seat-picker-viewport">
        {/* Stage Centered Box */}
        <div className="seat-picker-stage-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 4 4 4 7V17C4 20 8 22 12 22C16 22 20 20 20 17V7C20 4 16 2 12 2ZM12 4C15 4 18 5.3 18 7C18 8.7 15 10 12 10C9 10 6 8.7 6 7C6 5.3 9 4 12 4Z" />
          </svg>
          <span>Stage</span>
        </div>

        {/* 4-Block Full Seating Plan */}
        <div className="seat-matrix-wrapper">
          {ROW_NAMES.map((rName, idx) => renderRow(rName, idx))}
        </div>
      </main>

      {/* Bottom Sticky Action Bar */}
      <footer className="seat-picker-footer" role="contentinfo">
        <div className="seat-picker-footer-content">
          <div className="seat-picker-selection-info">
            <span className="seat-picker-tier-name">{categoryName}</span>
            <span className="seat-picker-detail-title">
              {selectedSeat
                ? `Early Bird | ${categoryName} (${selectedSeat.row}-${selectedSeat.number})`
                : 'Select your seats'}
            </span>
          </div>

          <div className="seat-picker-footer-right">
            <button
              type="button"
              className="seat-picker-info-btn"
              title="Category information"
              aria-label="Information"
            >
              i
            </button>

            {selectedSeat && (
              <>
                <div className="seat-picker-price-block">
                  <span className="seat-picker-price-amount">
                    ₹{seatPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="seat-picker-ticket-count">1 ticket</span>
                </div>

                <button
                  type="button"
                  className="seat-picker-cart-btn"
                  disabled={bookingLoading}
                  onClick={handleAddToCart}
                >
                  {bookingLoading ? 'Confirming...' : 'Add to cart'}
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
