import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './DistrictMoviesBookingPage.css';

// Movie Data for Anbil Avan (exact match with user screenshots)
const MOVIE_DETAILS = {
  id: 'anbil-avan-movie-tickets-in-coimbatore-MV231011',
  title: 'Anbil Avan',
  year: '2026',
  certificate: 'UA16+',
  runtime: '2h 37m',
  language: 'Tamil',
  genres: 'Romance, Action, Drama',
  poster:
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
};

// Date options (exact match with Screenshot 1)
const DATE_OPTIONS = [
  { dayNum: '7', dayName: 'Wed', dateStr: '2026-10-07' },
  { dayNum: '8', dayName: 'Thu', dateStr: '2026-10-08' },
  { dayNum: '9', dayName: 'Fri', dateStr: '2026-10-09' },
  { dayNum: '10', dayName: 'Sat', dateStr: '2026-10-10' },
  { dayNum: '11', dayName: 'Sun', dateStr: '2026-10-11' },
];

// Cinemas with Showtimes (exact match with Screenshots 1 & 2)
const CINEMA_SHOWTIMES = [
  {
    id: 'pvr-brookefields',
    name: 'PVR Brookefields Mall, Krishnaswamy Road, Coimbatore',
    logoType: 'pvr',
    logoText: 'PVR',
    distance: '1.2 km away',
    cancellation: 'Allows cancellation',
    cancellationAllowed: true,
    shows: [
      {
        time: '10:40 PM',
        format: '2D',
        status: 'available',
        subtitle: true,
        amenity: 'Recliner',
        hour: 22,
      },
    ],
  },
  {
    id: 'cinepolis-fun-cinema',
    name: 'Cinepolis Fun Cinema Republic Mall, Peelamedu, Coimbatore',
    logoType: 'cinepolis',
    logoText: 'cinépolis',
    distance: '4.7 km away',
    cancellation: 'Non-cancellable',
    cancellationAllowed: false,
    shows: [
      {
        time: '07:50 PM',
        format: '2D',
        status: 'filling-fast',
        subtitle: false,
        amenity: 'Couple Seats',
        hour: 19,
      },
      {
        time: '10:50 PM',
        format: '2D',
        status: 'available',
        subtitle: false,
        amenity: 'Recliner',
        hour: 22,
      },
    ],
  },
  {
    id: 'pvr-alveal-fun-savvy',
    name: 'PVR Alveal Fun Savvy Mall, Coimbatore',
    logoType: 'pvr',
    logoText: 'PVR',
    distance: '5.1 km away',
    cancellation: 'Allows cancellation',
    cancellationAllowed: true,
    shows: [
      {
        time: '10:15 PM',
        format: '2D',
        status: 'available',
        subtitle: true,
        amenity: 'Recliner',
        hour: 22,
      },
    ],
  },
  {
    id: 'inox-prozone',
    name: 'INOX Prozone Mall, Sathy Road, Coimbatore',
    logoType: 'inox',
    logoText: 'INOX',
    distance: '5.5 km away',
    cancellation: 'Allows cancellation',
    cancellationAllowed: true,
    shows: [
      {
        time: '10:35 PM',
        format: '2D',
        status: 'available',
        subtitle: true,
        amenity: 'Couple Seats',
        hour: 22,
      },
    ],
  },
  {
    id: 'miraj-cinemas-srk',
    name: 'Miraj Cinemas : SRK Mall, Coimbatore',
    logoType: 'miraj',
    logoText: 'MIRAJ',
    distance: '6.2 km away',
    cancellation: 'Allows cancellation',
    cancellationAllowed: true,
    shows: [
      {
        time: '10:45 PM',
        format: 'DOLBY 7.1',
        status: 'available',
        subtitle: false,
        amenity: 'Recliner',
        hour: 22,
      },
    ],
  },
];

// FAQ Accordion List (exact match with Screenshot 3)
const FAQS = [
  {
    id: 'faq-1',
    question: 'Where can I watch Anbil Avan in Madurai?',
    answer:
      'You can watch Anbil Avan in top multiplexes and single screens including PVR Brookefields, Cinepolis Fun Cinema, INOX Prozone Mall, and Miraj Cinemas with morning, evening, and late-night showtimes.',
  },
  {
    id: 'faq-2',
    question: 'When was Anbil Avan released?',
    answer:
      'Anbil Avan was officially released in theatres on 2 October 2026 across Tamil Nadu and worldwide.',
  },
  {
    id: 'faq-3',
    question: 'What is the runtime of Anbil Avan?',
    answer:
      'The total theatrical runtime of Anbil Avan is 2 hours and 37 minutes (157 minutes).',
  },
  {
    id: 'faq-4',
    question: 'What languages is Anbil Avan available in?',
    answer:
      'Anbil Avan is currently available in its original Tamil audio with English subtitles enabled at select multiplex screens.',
  },
  {
    id: 'faq-5',
    question: 'What is the censor rating of Anbil Avan?',
    answer:
      'The film has been certified UA16+ by the Central Board of Film Certification (CBFC).',
  },
  {
    id: 'faq-6',
    question: 'Who directed Anbil Avan?',
    answer:
      'Anbil Avan is directed by R. Kaarthikeyan and stars Ashok Selvan alongside Preity Mukhundhan.',
  },
  {
    id: 'faq-7',
    question: 'Movies Now Showing in Coimbatore – Latest Releases & Showtimes',
    answer:
      'Explore all currently running blockbuster titles including Anbil Avan, Sigma, Meesaya Murukku 2, and Doraemon with instant digital M-ticket booking on District by Zomato.',
  },
];

export default function DistrictMoviesBookingPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // State
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState(null); // 'After 9 PM', 'Recliners', 'Couple Seats'
  const [favorites, setFavorites] = useState({});
  const [openFaq, setOpenFaq] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Selected date
  const selectedDate = DATE_OPTIONS[selectedDateIndex];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const toggleFavorite = (cinemaId) => {
    setFavorites((prev) => {
      const updated = { ...prev, [cinemaId]: !prev[cinemaId] };
      showToast(updated[cinemaId] ? 'Added to favorite cinemas' : 'Removed from favorites');
      return updated;
    });
  };

  const handleFilterToggle = (filterName) => {
    setActiveFilter((prev) => (prev === filterName ? null : filterName));
  };

  // Filter cinemas & showtimes
  const filteredCinemas = useMemo(() => {
    return CINEMA_SHOWTIMES.map((cinema) => {
      let shows = cinema.shows;

      if (activeFilter === 'After 9 PM') {
        shows = shows.filter((s) => s.hour >= 21);
      } else if (activeFilter === 'Recliners') {
        shows = shows.filter((s) => s.amenity === 'Recliner');
      } else if (activeFilter === 'Couple Seats') {
        shows = shows.filter((s) => s.amenity === 'Couple Seats');
      }

      return {
        ...cinema,
        filteredShows: shows,
      };
    }).filter((cinema) => cinema.filteredShows.length > 0);
  }, [activeFilter]);

  const handleShowtimeSelect = (cinemaName, show) => {
    showToast(`Selected ${show.time} at ${cinemaName}! Opening seat matrix...`);
    setTimeout(() => {
      navigate('/movies/seat-layout/cgszjdlwp6o', {
        state: {
          movieTitle: MOVIE_DETAILS.title,
          cinema: cinemaName,
          time: show.time,
          date: `${selectedDate.dayNum} ${selectedDate.dayName} Oct`,
          format: show.format,
        },
      });
    }, 1000);
  };

  return (
    <div className="district-booking-app">
      {/* ========================================================
          TOP HEADER (EXACT REPLICA FROM SCREENSHOT 1)
          ======================================================== */}
      <header className="booking-top-header" role="banner">
        <div className="booking-container header-row">
          <div className="brand-group">
            <Link to="/movies" className="brand-logo-unit" aria-label="District by Zomato">
              <span className="brand-title-bold">district</span>
              <span className="brand-subtitle-mini">BY ZOMATO</span>
            </Link>

            <button
              className="location-tag-btn"
              onClick={() => showToast('Switched to Coimbatore')}
              title="Location"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="loc-pin"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div className="loc-label-col">
                <span className="city-title">Madurai</span>
                <span className="state-subtitle">Tamil Nadu</span>
              </div>
            </button>

            <nav className="header-nav-pills" aria-label="District Verticals">
              <Link to="/home" className="h-nav-link">
                For you
              </Link>
              <Link to="/home" className="h-nav-link">
                Dining
              </Link>
              <Link to="/movies" className="h-nav-link active">
                Movies
              </Link>
              <Link to="/events" className="h-nav-link">
                Events
              </Link>
            </nav>
          </div>

          <div className="header-search-and-user">
            <div className="header-search-capsule" role="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search for events, movies and restaurants"
                aria-label="Search"
              />
            </div>

            <button
              className="user-profile-circle"
              onClick={() => navigate('/profile')}
              aria-label="Account Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Stack (Right Edge) */}
      <aside className="booking-floating-sidebar" aria-label="Quick Actions">
        <button
          className="float-circle dark"
          onClick={() => showToast('No new notifications')}
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button
          className="float-circle dark"
          onClick={() => showToast('Saved to Wishlist')}
          title="Wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button
          className="float-circle purple"
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
          MOVIE SUMMARY BANNER (SCREENSHOT 1)
          ======================================================== */}
      <section className="movie-summary-strip" aria-label="Movie overview">
        <div className="booking-container summary-flex">
          <div className="movie-thumb-box">
            <img src={MOVIE_DETAILS.poster} alt={MOVIE_DETAILS.title} />
          </div>

          <div className="movie-info-col">
            <h1 className="movie-heading-h1">
              {MOVIE_DETAILS.title} <span className="year-paren">({MOVIE_DETAILS.year})</span>
            </h1>
            <div className="movie-specs-row">
              <span className="spec-item">{MOVIE_DETAILS.certificate}</span>
              <span className="spec-dot">•</span>
              <span className="spec-item">{MOVIE_DETAILS.runtime}</span>
            </div>
            <div className="movie-lang-line">{MOVIE_DETAILS.language}</div>
            <div className="movie-genres-line">{MOVIE_DETAILS.genres}</div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DATE SELECTOR STRIP (SCREENSHOT 1)
          ======================================================== */}
      <section className="date-picker-strip" aria-label="Select Date">
        <div className="booking-container date-picker-flex">
          {/* Vertical OCT indicator */}
          <div className="month-vertical-tag">OCT</div>

          {/* Date Chips Row */}
          <div className="date-chips-row" role="tablist">
            {DATE_OPTIONS.map((item, idx) => {
              const isSelected = selectedDateIndex === idx;
              return (
                <button
                  key={item.dateStr}
                  className={`date-chip-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedDateIndex(idx)}
                  role="tab"
                  aria-selected={isSelected}
                >
                  <span className="chip-day-num">{item.dayNum}</span>
                  <span className="chip-day-name">{item.dayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          FILTERS ROW (SCREENSHOT 1)
          ======================================================== */}
      <section className="booking-filters-strip" aria-label="Showtime filters">
        <div className="booking-container filters-flex">
          <button
            className="filter-pill-trigger"
            onClick={() => setActiveFilter(null)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Filters
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {['After 9 PM', 'Recliners', 'Couple Seats'].map((f) => (
            <button
              key={f}
              className={`filter-btn-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => handleFilterToggle(f)}
            >
              {f}
            </button>
          ))}

          {activeFilter && (
            <button className="clear-filter-btn" onClick={() => setActiveFilter(null)}>
              Clear
            </button>
          )}
        </div>
      </section>

      {/* ========================================================
          STATUS LEGENDS STRIP (SCREENSHOT 1)
          ======================================================== */}
      <section className="status-legends-strip">
        <div className="booking-container legends-flex">
          <div className="legend-item">
            <span className="sub-box-icon">🔲</span>
            <span>English subtitle</span>
          </div>
          <div className="legend-item">
            <span className="dot-icon available">●</span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="dot-icon filling-fast">●</span>
            <span>Filling fast</span>
          </div>
          <div className="legend-item">
            <span className="dot-icon almost-full">●</span>
            <span>Almost full</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          CINEMA SHOWTIMES CARDS LIST (SCREENSHOTS 1 & 2)
          ======================================================== */}
      <main className="cinemas-list-section">
        <div className="booking-container cinema-cards-stack">
          {filteredCinemas.length > 0 ? (
            filteredCinemas.map((cinema) => {
              const isFav = !!favorites[cinema.id];
              return (
                <article key={cinema.id} className="cinema-card-entry">
                  {/* Left Cinema Header Info */}
                  <div className="cinema-meta-pane">
                    <div className="cinema-logo-cluster">
                      <div className={`cinema-round-badge ${cinema.logoType}`}>
                        {cinema.logoText}
                      </div>

                      <div className="cinema-naming-box">
                        <div className="cinema-title-row">
                          <h2 className="cinema-title-text">{cinema.name}</h2>
                          <span className="info-circle-icon" title="View cinema details">
                            ⓘ
                          </span>
                        </div>

                        <div className="cinema-sub-badges-row">
                          <span className="dist-label">{cinema.distance}</span>
                          <span className="diamond-sep">◈</span>
                          <span
                            className={`cancellation-label ${
                              cinema.cancellationAllowed ? 'allowed' : 'not-allowed'
                            }`}
                          >
                            {cinema.cancellation}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`favorite-heart-btn ${isFav ? 'active' : ''}`}
                      onClick={() => toggleFavorite(cinema.id)}
                      aria-label="Add to favorites"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#E96F49' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Right Showtimes Slots */}
                  <div className="showtimes-chips-pane">
                    {cinema.filteredShows.map((show, idx) => (
                      <button
                        key={idx}
                        className={`show-slot-card ${show.status}`}
                        onClick={() => handleShowtimeSelect(cinema.name, show)}
                        title={`Click to book ${show.time}`}
                      >
                        <div className="slot-time-text">{show.time}</div>
                        {show.format && show.format !== '2D' && (
                          <div className="slot-format-text">{show.format}</div>
                        )}
                        {show.subtitle && (
                          <div className="slot-sub-icon" title="English Subtitles">
                            🔲
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="no-cinemas-box">
              <p>No showtimes match the selected filter on this date.</p>
              <button className="reset-filter-btn" onClick={() => setActiveFilter(null)}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          FAQ ACCORDIONS SECTION (SCREENSHOT 3)
          ======================================================== */}
      <section className="booking-faqs-section" aria-label="Showtimes FAQ">
        <div className="booking-container">
          <div className="faq-accordions-stack">
            {FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id} className={`faq-accordion-card ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-accordion-header"
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="faq-arrow-chevron"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {isOpen && <div className="faq-accordion-body">{faq.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Toast Notice */}
      {toastMessage && <div className="booking-toast-pill">{toastMessage}</div>}

      {/* Footer */}
      <footer className="booking-footer-bar" role="contentinfo">
        <div className="booking-container footer-flex">
          <div className="footer-brand-side">
            <span className="brand-title-bold" style={{ fontSize: '18px' }}>
              district
            </span>
            <span>&copy; 2026 District by Zomato Ltd. All rights reserved.</span>
          </div>
          <div className="footer-notice-side">
            Powered by District by Zomato Movies Engine • Coimbatore
          </div>
        </div>
      </footer>
    </div>
  );
}
