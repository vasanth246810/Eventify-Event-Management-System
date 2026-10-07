import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import './DistrictMovieTicketBookingPage.css';

// Showtimes list (Screenshot 1)
const SHOWTIMES = [
  { time: '10:30 AM', id: 'show-1' },
  { time: '12:35 PM', id: 'show-2' },
  { time: '03:50 PM', id: 'show-3' },
  { time: '07:45 PM', id: 'show-4' },
  { time: '10:55 PM', id: 'show-5' },
];

// Executive Tier Seating Data (₹183.8) - Rows A to K matching Screenshots 1 & 2
const INITIAL_EXECUTIVE_ROWS = [
  {
    row: 'A',
    left: [{ id: 'A1', type: 'occupied' }, { id: 'A2', type: 'occupied' }],
    center: [
      { id: 'A3', num: '3', type: 'best' },
      { id: 'A4', num: '4', type: 'best' },
      { id: 'Ax1', type: 'occupied' },
      { id: 'Ax2', type: 'occupied' },
      { id: 'Ax3', type: 'occupied' },
      { id: 'Ax4', type: 'occupied' },
      { id: 'Ax5', type: 'occupied' },
      { id: 'Ax6', type: 'occupied' },
      { id: 'Ax7', type: 'occupied' },
      { id: 'Ax8', type: 'occupied' },
      { id: 'Ax9', type: 'occupied' },
      { id: 'Ax10', type: 'occupied' },
      { id: 'A16', num: '16', type: 'best' },
      { id: 'A17', num: '17', type: 'best' },
      { id: 'A18', num: '18', type: 'best' },
      { id: 'Ax11', type: 'occupied' },
      { id: 'Ax12', type: 'occupied' },
      { id: 'A21', num: '21', type: 'best' },
      { id: 'A22', num: '22', type: 'best' },
    ],
    right: [{ id: 'Ax13', type: 'occupied' }],
  },
  {
    row: 'B',
    left: [{ id: 'B1', num: '1', type: 'available' }, { id: 'B2', num: '2', type: 'available' }, { id: 'B3', num: '3', type: 'available' }],
    center: [
      { id: 'B4', num: '4', type: 'best' },
      { id: 'B5', num: '5', type: 'best' },
      { id: 'B6', num: '6', type: 'best' },
      { id: 'B7', num: '7', type: 'best' },
      { id: 'B8', num: '8', type: 'best' },
      { id: 'B9', num: '9', type: 'best' },
      { id: 'B10', num: '10', type: 'best' },
      { id: 'B11', num: '11', type: 'best' },
      { id: 'B12', num: '12', type: 'best' },
      { id: 'B13', num: '13', type: 'best' },
      { id: 'B14', num: '14', type: 'best' },
      { id: 'B15', num: '15', type: 'best' },
      { id: 'B16', num: '16', type: 'best' },
    ],
    right: [{ id: 'B17', num: '17', type: 'available' }, { id: 'B18', num: '18', type: 'available' }],
  },
  {
    row: 'C',
    left: [{ id: 'C1', num: '1', type: 'available' }, { id: 'C2', num: '2', type: 'available' }, { id: 'C3', num: '3', type: 'available' }],
    center: [
      { id: 'C4', num: '4', type: 'best' },
      { id: 'C5', num: '5', type: 'best' },
      { id: 'C6', num: '6', type: 'best' },
      { id: 'C7', num: '7', type: 'best' },
      { id: 'C8', num: '8', type: 'best' },
      { id: 'Cx1', type: 'occupied' },
      { id: 'Cx2', type: 'occupied' },
      { id: 'C11', num: '11', type: 'best' },
      { id: 'C12', num: '12', type: 'best' },
      { id: 'C13', num: '13', type: 'best' },
      { id: 'C14', num: '14', type: 'best' },
      { id: 'C15', num: '15', type: 'best' },
      { id: 'C16', num: '16', type: 'best' },
    ],
    right: [{ id: 'C17', num: '17', type: 'available' }, { id: 'C18', num: '18', type: 'available' }],
  },
  {
    row: 'D',
    left: [{ id: 'D1', num: '1', type: 'available' }, { id: 'D2', num: '2', type: 'available' }, { id: 'D3', num: '3', type: 'available' }],
    center: [
      { id: 'D4', num: '4', type: 'best' },
      { id: 'D5', num: '5', type: 'best' },
      { id: 'D6', num: '6', type: 'best' },
      { id: 'D7', num: '7', type: 'best' },
      { id: 'D8', num: '8', type: 'best' },
      { id: 'Dx1', type: 'occupied' },
      { id: 'Dx2', type: 'occupied' },
      { id: 'Dx3', type: 'occupied' },
      { id: 'Dx4', type: 'occupied' },
      { id: 'Dx5', type: 'occupied' },
      { id: 'Dx6', type: 'occupied' },
      { id: 'Dx7', type: 'occupied' },
      { id: 'Dx8', type: 'occupied' },
    ],
    right: [{ id: 'D17', num: '17', type: 'available' }, { id: 'D18', num: '18', type: 'available' }],
  },
  {
    row: 'E',
    left: [{ id: 'E1', num: '1', type: 'available' }, { id: 'E2', num: '2', type: 'available' }, { id: 'E3', num: '3', type: 'available' }],
    center: [
      { id: 'E4', num: '4', type: 'available' },
      { id: 'E5', num: '5', type: 'available' },
      { id: 'E6', num: '6', type: 'best' },
      { id: 'E7', num: '7', type: 'best' },
      { id: 'E8', num: '8', type: 'best' },
      { id: 'E9', num: '9', type: 'best' },
      { id: 'E10', num: '10', type: 'best' },
      { id: 'E11', num: '11', type: 'best' },
      { id: 'E12', num: '12', type: 'best' },
      { id: 'E13', num: '13', type: 'best' },
      { id: 'E14', num: '14', type: 'best' },
      { id: 'E15', num: '15', type: 'best' },
      { id: 'E16', num: '16', type: 'available' },
    ],
    right: [{ id: 'E17', num: '17', type: 'available' }, { id: 'E18', num: '18', type: 'available' }],
  },
  {
    row: 'F',
    left: [{ id: 'F1', num: '1', type: 'available' }, { id: 'F2', num: '2', type: 'available' }, { id: 'F3', num: '3', type: 'available' }],
    center: [
      { id: 'F4', num: '4', type: 'available' },
      { id: 'F5', num: '5', type: 'available' },
      { id: 'F6', num: '6', type: 'available' },
      { id: 'F7', num: '7', type: 'available' },
      { id: 'F8', num: '8', type: 'best' },
      { id: 'F9', num: '9', type: 'best' },
      { id: 'F10', num: '10', type: 'best' },
      { id: 'F11', num: '11', type: 'best' },
      { id: 'F12', num: '12', type: 'best' },
      { id: 'F13', num: '13', type: 'available' },
      { id: 'F14', num: '14', type: 'available' },
      { id: 'F15', num: '15', type: 'available' },
      { id: 'F16', num: '16', type: 'available' },
    ],
    right: [{ id: 'F17', num: '17', type: 'available' }, { id: 'F18', num: '18', type: 'available' }],
  },
  {
    row: 'G',
    left: [{ id: 'G1', num: '1', type: 'available' }, { id: 'G2', num: '2', type: 'available' }, { id: 'G3', num: '3', type: 'available' }],
    center: [
      { id: 'G4', num: '4', type: 'available' },
      { id: 'G5', num: '5', type: 'available' },
      { id: 'G6', num: '6', type: 'available' },
      { id: 'G7', num: '7', type: 'available' },
      { id: 'G8', num: '8', type: 'available' },
      { id: 'G9', num: '9', type: 'available' },
      { id: 'G10', num: '10', type: 'available' },
      { id: 'G11', num: '11', type: 'available' },
      { id: 'G12', num: '12', type: 'available' },
      { id: 'G13', num: '13', type: 'available' },
      { id: 'G14', num: '14', type: 'available' },
      { id: 'G15', num: '15', type: 'available' },
      { id: 'G16', num: '16', type: 'available' },
    ],
    right: [{ id: 'G17', num: '17', type: 'available' }, { id: 'G18', num: '18', type: 'available' }],
  },
  {
    row: 'H',
    left: [],
    center: [
      { id: 'H1', num: '1', type: 'available' },
      { id: 'H2', num: '2', type: 'available' },
      { id: 'H3', num: '3', type: 'available' },
      { id: 'H4', num: '4', type: 'available' },
      { id: 'H5', num: '5', type: 'available' },
      { id: 'H6', num: '6', type: 'available' },
      { id: 'H7', num: '7', type: 'available' },
      { id: 'H8', num: '8', type: 'available' },
      { id: 'H9', num: '9', type: 'available' },
      { id: 'H10', num: '10', type: 'available' },
      { id: 'H11', num: '11', type: 'available' },
      { id: 'H12', num: '12', type: 'available' },
      { id: 'H13', num: '13', type: 'available' },
    ],
    right: [{ id: 'H14', num: '14', type: 'available' }, { id: 'H15', num: '15', type: 'available' }],
  },
  {
    row: 'I',
    left: [],
    center: [
      { id: 'I1', num: '1', type: 'available' },
      { id: 'I2', num: '2', type: 'available' },
      { id: 'I3', num: '3', type: 'available' },
      { id: 'I4', num: '4', type: 'available' },
      { id: 'I5', num: '5', type: 'available' },
      { id: 'I6', num: '6', type: 'available' },
      { id: 'I7', num: '7', type: 'available' },
      { id: 'I8', num: '8', type: 'available' },
      { id: 'I9', num: '9', type: 'available' },
      { id: 'I10', num: '10', type: 'available' },
      { id: 'I11', num: '11', type: 'available' },
      { id: 'I12', num: '12', type: 'available' },
      { id: 'I13', num: '13', type: 'available' },
    ],
    right: [{ id: 'I14', num: '14', type: 'available' }, { id: 'I15', num: '15', type: 'available' }],
  },
  {
    row: 'J',
    left: [],
    center: [
      { id: 'J1', num: '1', type: 'available' },
      { id: 'J2', num: '2', type: 'available' },
      { id: 'J3', num: '3', type: 'available' },
      { id: 'J4', num: '4', type: 'available' },
      { id: 'J5', num: '5', type: 'available' },
      { id: 'J6', num: '6', type: 'available' },
      { id: 'J7', num: '7', type: 'available' },
      { id: 'J8', num: '8', type: 'available' },
      { id: 'J9', num: '9', type: 'available' },
      { id: 'J10', num: '10', type: 'available' },
      { id: 'J11', num: '11', type: 'available' },
      { id: 'J12', num: '12', type: 'available' },
      { id: 'J13', num: '13', type: 'available' },
    ],
    right: [{ id: 'J14', num: '14', type: 'available' }, { id: 'J15', num: '15', type: 'available' }],
  },
  {
    row: 'K',
    left: [],
    center: [
      { id: 'K7', num: '7', type: 'available' },
      { id: 'K8', num: '8', type: 'available' },
      { id: 'K9', num: '9', type: 'available' },
      { id: 'K10', num: '10', type: 'available' },
      { id: 'K11', num: '11', type: 'available' },
      { id: 'K12', num: '12', type: 'available' },
      { id: 'K13', num: '13', type: 'available' },
    ],
    right: [{ id: 'K14', num: '14', type: 'available' }, { id: 'K15', num: '15', type: 'available' }],
  },
];

// Normal Tier Seating Data (₹54.35) - Screenshot 3
const INITIAL_NORMAL_ROWS = [
  {
    row: 'L',
    left: [{ id: 'L1', num: '1', type: 'available' }],
    center: [
      { id: 'Lx1', type: 'occupied' },
      { id: 'Lx2', type: 'occupied' },
      { id: 'Lx3', type: 'occupied' },
      { id: 'Lx4', type: 'occupied' },
      { id: 'Lx5', type: 'occupied' },
    ],
    right: [{ id: 'Lx6', type: 'occupied' }, { id: 'Lx7', type: 'occupied' }, { id: 'Lx8', type: 'occupied' }],
  },
  {
    row: 'M',
    left: [],
    center: [
      { id: 'Mx1', type: 'occupied' },
      { id: 'Mx2', type: 'occupied' },
      { id: 'Mx3', type: 'occupied' },
      { id: 'Mx4', type: 'occupied' },
      { id: 'Mx5', type: 'occupied' },
      { id: 'Mx6', type: 'occupied' },
      { id: 'Mx7', type: 'occupied' },
      { id: 'Mx8', type: 'occupied' },
    ],
    right: [{ id: 'Mx9', type: 'occupied' }, { id: 'Mx10', type: 'occupied' }, { id: 'Mx11', type: 'occupied' }],
  },
];

export default function DistrictMovieTicketBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Selected showtime
  const [activeShowIndex, setActiveShowIndex] = useState(0);

  // Selected Seats set
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Cinema & movie metadata from route state or defaults
  const movieMeta = useMemo(() => {
    return {
      title: location.state?.movieTitle || 'Anbil Avan',
      cinema:
        location.state?.cinema ||
        'Cinepolis Fun Cinema Republic Mall, Peelamedu, Coimbatore',
      date: location.state?.date || '8 Oct',
      time: SHOWTIMES[activeShowIndex].time,
    };
  }, [location.state, activeShowIndex]);

  // Pricing constants
  const EXECUTIVE_PRICE = 183.8;
  const NORMAL_PRICE = 54.35;

  // Toggle seat
  const handleSeatClick = (seat, tier) => {
    if (seat.type === 'occupied') return;

    const exists = selectedSeats.find((s) => s.id === seat.id);

    if (exists) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        showToast('Maximum 10 seats allowed per booking');
        return;
      }
      const price = tier === 'EXECUTIVE' ? EXECUTIVE_PRICE : NORMAL_PRICE;
      setSelectedSeats((prev) => [...prev, { ...seat, tier, price }]);
    }
  };

  // Total amount
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const handleProceedPayment = () => {
    if (selectedSeats.length === 0) {
      showToast('Please select at least 1 seat');
      return;
    }
    showToast(`Booking ${selectedSeats.length} seats for ₹${totalPrice.toFixed(2)}...`);
    setTimeout(() => {
      navigate('/buy-page', {
        state: {
          movieTitle: movieMeta.title,
          cinema: movieMeta.cinema,
          time: movieMeta.time,
          selectedSeats: selectedSeats.map((s) => s.id).join(', '),
          totalPrice: totalPrice,
        },
      });
    }, 1200);
  };

  // Render a seat button
  const renderSeat = (seat, tier) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    const isOccupied = seat.type === 'occupied';
    const isBest = seat.type === 'best';

    let classNames = 'seat-cell';
    if (isOccupied) classNames += ' occupied';
    else if (isSelected) classNames += ' selected';
    else if (isBest) classNames += ' best-seat';
    else classNames += ' available';

    return (
      <button
        key={seat.id}
        className={classNames}
        disabled={isOccupied}
        onClick={() => handleSeatClick(seat, tier)}
        title={
          isOccupied
            ? 'Occupied'
            : isSelected
            ? `Selected: ${seat.id}`
            : isBest
            ? `Best Seat: ${seat.id} (${tier}: ₹${tier === 'EXECUTIVE' ? EXECUTIVE_PRICE : NORMAL_PRICE})`
            : `${seat.id} (${tier}: ₹${tier === 'EXECUTIVE' ? EXECUTIVE_PRICE : NORMAL_PRICE})`
        }
      >
        {isOccupied ? '✕' : seat.num || ''}
      </button>
    );
  };

  return (
    <div className="district-seat-layout-page">
      {/* ========================================================
          TOP NAVBAR (EXACT REPLICA FROM SCREENSHOT 1)
          ======================================================== */}
      <header className="seat-top-navbar" role="banner">
        <div className="seat-navbar-container">
          <Link to="/movies" className="brand-unit" aria-label="District by Zomato Home">
            <span className="brand-logo-txt">district</span>
            <span className="brand-sub-txt">BY ZOMATO</span>
          </Link>

          <div className="movie-header-center">
            <h1 className="movie-head-title">{movieMeta.title}</h1>
            <p className="movie-head-sub">
              {movieMeta.date}, {movieMeta.time} at {movieMeta.cinema}
            </p>
          </div>

          <button
            className="user-profile-circle-btn"
            onClick={() => navigate('/profile')}
            aria-label="Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </header>

      {/* Floating Right Dock */}
      <aside className="dock-sidebar" aria-label="Quick Actions">
        <button
          className="dock-bubble dark"
          onClick={() => showToast('No new notifications')}
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button
          className="dock-bubble dark"
          onClick={() => showToast('Saved to Wishlist')}
          title="Wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button
          className="dock-bubble purple"
          onClick={() => showToast('Opening District Bag')}
          title="District Bag"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
      </aside>

      {/* ========================================================
          SHOWTIME SWITCHER BAR (SCREENSHOT 1)
          ======================================================== */}
      <section className="showtime-switcher-strip">
        <div className="layout-content-container">
          <div className="showtimes-nav-row">
            <div className="date-tag-block">
              <span className="day-name-txt">Thu</span>
              <span className="day-num-txt">08 Oct</span>
            </div>

            <div className="timing-pills-row" role="tablist">
              {SHOWTIMES.map((s, idx) => (
                <button
                  key={s.id}
                  className={`timing-pill-btn ${activeShowIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    setActiveShowIndex(idx);
                    showToast(`Switched to ${s.time}`);
                  }}
                  role="tab"
                  aria-selected={activeShowIndex === idx}
                >
                  {s.time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SEATING MATRIX CONTAINER (SCREENSHOTS 1, 2, 3)
          ======================================================== */}
      <main className="seat-matrix-main-section">
        <div className="layout-content-container">
          {/* Executive Tier Heading */}
          <div className="tier-heading-banner">
            <span className="tier-label">EXECUTIVE : ₹{EXECUTIVE_PRICE}</span>
          </div>

          {/* Executive Rows (A to K) */}
          <div className="rows-vertical-stack">
            {INITIAL_EXECUTIVE_ROWS.map((rowData) => (
              <div key={rowData.row} className="seating-row-line">
                <span className="row-letter-label">{rowData.row}</span>

                <div className="blocks-row-flex">
                  {/* Left Block */}
                  <div className="seat-block left">
                    {rowData.left.map((s) => renderSeat(s, 'EXECUTIVE'))}
                  </div>

                  {/* Center Block */}
                  <div className="seat-block center">
                    {rowData.center.map((s) => renderSeat(s, 'EXECUTIVE'))}
                  </div>

                  {/* Right Block */}
                  <div className="seat-block right">
                    {rowData.right.map((s) => renderSeat(s, 'EXECUTIVE'))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Normal Tier Heading (Screenshot 3) */}
          <div className="tier-heading-banner" style={{ marginTop: '36px' }}>
            <span className="tier-label">NORMAL : ₹{NORMAL_PRICE}</span>
          </div>

          {/* Normal Rows (L & M) */}
          <div className="rows-vertical-stack">
            {INITIAL_NORMAL_ROWS.map((rowData) => (
              <div key={rowData.row} className="seating-row-line">
                <span className="row-letter-label">{rowData.row}</span>

                <div className="blocks-row-flex">
                  <div className="seat-block left">
                    {rowData.left.map((s) => renderSeat(s, 'NORMAL'))}
                  </div>

                  <div className="seat-block center">
                    {rowData.center.map((s) => renderSeat(s, 'NORMAL'))}
                  </div>

                  <div className="seat-block right">
                    {rowData.right.map((s) => renderSeat(s, 'NORMAL'))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================
              SCREEN DIRECTION & 3D TRAPEZOIDAL GRAPHIC (SCREENSHOT 3)
              ======================================================== */}
          <div className="cinema-screen-area">
            <div className="screen-caption-tag">SCREEN THIS WAY</div>
            <div className="screen-curved-graphic" aria-hidden="true"></div>
          </div>

          {/* ========================================================
              STATUS LEGENDS STRIP (SCREENSHOTS 1, 2, 3)
              ======================================================== */}
          <div className="seat-legends-bar">
            <div className="legend-entry">
              <span className="legend-sample best-seat"></span>
              <span>Best Seats ✪</span>
            </div>
            <div className="legend-entry">
              <span className="legend-sample available"></span>
              <span>Available</span>
            </div>
            <div className="legend-entry">
              <span className="legend-sample occupied">✕</span>
              <span>Occupied</span>
            </div>
            <div className="legend-entry">
              <span className="legend-sample selected"></span>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================
          STICKY BOTTOM CHECKOUT TICKET BAR (WHEN SEATS SELECTED)
          ======================================================== */}
      {selectedSeats.length > 0 && (
        <aside className="sticky-booking-bottom-bar" role="region" aria-label="Ticket selection summary">
          <div className="layout-content-container bottom-flex-row">
            <div className="selected-summary-col">
              <div className="selected-seats-pills">
                {selectedSeats.map((s) => (
                  <span key={s.id} className="selected-seat-chip">
                    {s.id}
                  </span>
                ))}
              </div>
              <div className="seats-count-text">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} Selected
              </div>
            </div>

            <div className="pricing-and-pay-col">
              <div className="price-total-text">₹{totalPrice.toFixed(2)}</div>
              <button
                className="btn-proceed-pay-pill"
                onClick={handleProceedPayment}
              >
                Pay ₹{totalPrice.toFixed(2)}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Toast */}
      {toastMessage && <div className="seat-toast-pill">{toastMessage}</div>}
    </div>
  );
}
