import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import './DistrictMovieDetail.css';

// Multi-movie Catalog supporting Anbil Avan (Screenshots 1-3) & other films
const MOVIE_CATALOG = {
  'anbil-avan-movie-tickets-MV231011': {
    id: 'anbil-avan-movie-tickets-MV231011',
    title: 'Anbil Avan',
    certificate: 'UA16+',
    language: 'Tamil',
    runtime: '2h 37m',
    releaseDate: 'Released 2 October 2026',
    synopsis:
      'A newly married couple finds their relationship tested when extraordinary circumstances pull them into danger. Starring Ashok Selvan and Preity Mukhundhan, this action-romance explores how love holds up when life takes an unexpected turn.',
    genres: ['Romance', 'Action', 'Drama'],
    backdropImg:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    posterImg:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=640&q=80',
    cast: [
      {
        name: 'Ashok Selvan',
        role: '',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      },
      {
        name: 'Preity Mukhundhan',
        role: '',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80',
      },
      {
        name: 'Delhi Ganesh',
        role: '',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        name: 'Sabumon Abdusamad',
        role: '',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      },
      {
        name: 'R. Kaarthikeyan',
        role: 'Director',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      },
    ],
    trailers: [
      {
        id: 'v1',
        title:
          'Anbil Avan - Title Announcement | Ashok Selvan, Preity Mukhundhan | Govind Vasantha |...',
        duration: '1:29',
        thumb:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=640&q=80',
      },
      {
        id: 'v2',
        title:
          'Anbil Avan - Official Trailer | Ashok Selvan | Preity Mukhundhan | Govind Vasantha |...',
        duration: '2:30',
        thumb:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=640&q=80',
      },
    ],
    wallpapers: [
      {
        id: 'p1',
        thumb:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      },
    ],
    faqs: [
      {
        id: 'f1',
        question: 'When was Anbil Avan released?',
        answer:
          'Anbil Avan was officially released in theatres on 2 October 2026 across Tamil Nadu and worldwide.',
      },
      {
        id: 'f2',
        question: 'What is the runtime of Anbil Avan?',
        answer:
          'The theatrical runtime of Anbil Avan is 2 hours and 37 minutes (157 minutes).',
      },
      {
        id: 'f3',
        question: 'What languages is Anbil Avan available in?',
        answer:
          'Anbil Avan is currently showing in its original Tamil audio track with English subtitles enabled at select multiplex locations.',
      },
      {
        id: 'f4',
        question: 'What is the censor rating of Anbil Avan?',
        answer:
          'The Central Board of Film Certification (CBFC) certified Anbil Avan as UA16+, suitable for viewers aged 16 and above.',
      },
    ],
  },
  'sigma': {
    id: 'sigma',
    title: 'Sigma',
    certificate: 'UA16+',
    language: 'Tamil',
    runtime: '2h 24m',
    releaseDate: 'Released 18 September 2026',
    synopsis:
      'Sigma follows a fearless maverick defying all norms to chase grand dreams. This high-octane blend of treasure hunts and heist tension delivers an adventurous mix of action and sharp humor.',
    genres: ['Action', 'Drama', 'Heist'],
    backdropImg:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    posterImg:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=640&q=80',
    cast: [
      {
        name: 'Sundeep Kishan',
        role: 'Lead',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        name: 'Vijay Sethupathi',
        role: 'Mentor',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      },
      {
        name: 'Gautham Menon',
        role: 'Antagonist',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      },
    ],
    trailers: [
      {
        id: 's1',
        title: 'Sigma - Official Teaser | Sundeep Kishan, Vijay Sethupathi |...',
        duration: '1:45',
        thumb:
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=640&q=80',
      },
    ],
    wallpapers: [
      {
        id: 'sp1',
        thumb:
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80',
      },
    ],
    faqs: [
      {
        id: 'sf1',
        question: 'When was Sigma released?',
        answer: 'Sigma was released in theatres on 18 September 2026.',
      },
      {
        id: 'sf2',
        question: 'What is the censor rating of Sigma?',
        answer: 'Sigma is certified UA16+ for stylized action sequences.',
      },
    ],
  },
};

// Aliases
MOVIE_CATALOG['anbil-avan'] = MOVIE_CATALOG['anbil-avan-movie-tickets-MV231011'];

const CITIES = [
  { city: 'Madurai', state: 'Tamil Nadu' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
];

export default function DistrictMovieDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find active movie or fallback to Anbil Avan
  const movie = useMemo(() => {
    if (id && MOVIE_CATALOG[id]) {
      return MOVIE_CATALOG[id];
    }
    return MOVIE_CATALOG['anbil-avan-movie-tickets-MV231011'];
  }, [id]);

  // Location Switcher
  const [cityIndex, setCityIndex] = useState(0);
  const currentCity = CITIES[cityIndex];

  // Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  // Modals
  const [showShowtimesModal, setShowShowtimesModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCityToggle = () => {
    const next = (cityIndex + 1) % CITIES.length;
    setCityIndex(next);
    showToast(`Location set to ${CITIES[next].city}, ${CITIES[next].state}`);
  };

  const handleBookSlot = (cinema, time) => {
    setShowShowtimesModal(false);
    showToast(`Selected ${time} at ${cinema}! Opening seat selection...`);
    setTimeout(() => {
      navigate('/buy-page', {
        state: {
          movieTitle: movie.title,
          cinema: cinema,
          time: time,
        },
      });
    }, 1200);
  };

  return (
    <div className="district-detail-app">
      {/* ========================================================
          TOP NAVIGATION HEADER (SCREENSHOT 1)
          ======================================================== */}
      <header className="district-detail-header" role="banner">
        <div className="detail-container header-inner">
          <div className="brand-group">
            <Link to="/movies" className="brand-logo-stack" aria-label="District by Zomato Home">
              <span className="brand-title">district</span>
              <span className="brand-subtitle">BY ZOMATO</span>
            </Link>

            <button
              className="location-switcher-btn"
              onClick={handleCityToggle}
              title="Change City"
              aria-label={`Current location: ${currentCity.city}, ${currentCity.state}`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="loc-icon"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div className="loc-text">
                <span className="loc-city-name">{currentCity.city}</span>
                <span className="loc-state-name">{currentCity.state}</span>
              </div>
            </button>

            <nav className="nav-vertical-pills" aria-label="District Verticals">
              <Link to="/home" className="nav-pill">
                For you
              </Link>
              <Link to="/home" className="nav-pill">
                Dining
              </Link>
              <Link to="/movies" className="nav-pill active">
                Movies
              </Link>
              <Link to="/events" className="nav-pill">
                Events
              </Link>
            </nav>
          </div>

          <div className="header-search-box-wrap">
            <div className="search-rounded-pill" role="search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" placeholder="Search for events, movies and restaurants" aria-label="Search" />
            </div>

            <button
              className="profile-circle-btn"
              onClick={() => navigate('/profile')}
              aria-label="User Profile"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Right Sidebar Action Button */}
      <aside className="floating-dock-aside" aria-label="Quick Actions">
        <button
          className="dock-icon-btn purple"
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
          MOVIE HERO DETAIL BANNER (SCREENSHOT 1)
          ======================================================== */}
      <section className="detail-hero-section" aria-label="Movie Hero">
        <div
          className="detail-hero-backdrop"
          style={{ backgroundImage: `url(${movie.backdropImg})` }}
        ></div>

        <div className="detail-container detail-hero-inner">
          <div className="hero-text-pane">
            <h1 className="hero-title-h1">{movie.title}</h1>

            <div className="hero-metadata-line">
              <span>{movie.certificate}</span>
              <span className="sep-divider">|</span>
              <span>{movie.language}</span>
              <span className="sep-divider">|</span>
              <span>{movie.runtime}</span>
            </div>

            <p className="hero-synopsis-text">{movie.synopsis}</p>

            <div className="hero-genres-row">
              {movie.genres.map((g) => (
                <span key={g} className="genre-capsule-tag">
                  {g}
                </span>
              ))}
            </div>

            <div className="hero-release-label">{movie.releaseDate}</div>

            <div>
              <button
                className="btn-book-tickets-cta"
                onClick={() => {
                  if (movie.id === 'anbil-avan-movie-tickets-MV231011') {
                    navigate('/movies/anbil-avan-movie-tickets-in-coimbatore-MV231011');
                  } else {
                    navigate(`/movies/booking/${movie.id}`);
                  }
                }}
              >
                Book Tickets
              </button>
            </div>
          </div>

          <div className="hero-poster-pane">
            <div
              className="hero-poster-frame"
              onClick={() => setShowShowtimesModal(true)}
              title="Click to view showtimes"
            >
              <img
                src={movie.posterImg}
                alt={`${movie.title} Poster`}
                className="hero-poster-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CAST & CREW (SCREENSHOTS 1 & 3)
          ======================================================== */}
      <section className="cast-crew-shelf">
        <div className="detail-container">
          <h2 className="shelf-title">Cast & Crew</h2>

          <div className="cast-avatars-row">
            {movie.cast.map((c, idx) => (
              <div key={idx} className="cast-profile-card">
                <div className="cast-round-avatar">
                  <img src={c.avatar} alt={c.name} />
                </div>
                <div className="cast-person-name">{c.name}</div>
                {c.role && <div className="cast-person-role">{c.role}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          TRAILERS & VIDEOS (SCREENSHOT 3)
          ======================================================== */}
      <section className="trailers-shelf">
        <div className="detail-container">
          <h2 className="shelf-title">Trailers & Videos</h2>

          <div className="trailers-card-flex">
            {movie.trailers.map((v) => (
              <div
                key={v.id}
                className="trailer-video-card"
                onClick={() => setActiveVideo(v)}
              >
                <div className="trailer-thumbnail-wrap">
                  <img src={v.thumb} alt={v.title} className="trailer-thumb-pic" />
                  <div className="play-button-overlay">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <span className="duration-tag">{v.duration}</span>
                </div>
                <p className="trailer-title-caption">{v.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          POSTERS & WALLPAPERS (SCREENSHOTS 2 & 3)
          ======================================================== */}
      <section className="wallpapers-shelf">
        <div className="detail-container">
          <h2 className="shelf-title">Posters & Wallpapers</h2>

          <div className="wallpapers-row">
            {movie.wallpapers.map((p) => (
              <div
                key={p.id}
                className="wallpaper-card-item"
                onClick={() => setShowShowtimesModal(true)}
              >
                <img src={p.thumb} alt="Poster" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FAQ ACCORDIONS (SCREENSHOT 2)
          ======================================================== */}
      <section className="faq-accordions-shelf">
        <div className="detail-container">
          <div className="faq-vertical-stack">
            {movie.faqs.map((f) => {
              const isOpen = openFaq === f.id;
              return (
                <div key={f.id} className={`faq-tile-card ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-tile-header"
                    onClick={() => setOpenFaq(isOpen ? null : f.id)}
                  >
                    <span>{f.question}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="faq-chevron"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {isOpen && <div className="faq-tile-body">{f.answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SHOWTIMES BOOKING MODAL
          ======================================================== */}
      {showShowtimesModal && (
        <div
          className="modal-backdrop-layer"
          onClick={() => setShowShowtimesModal(false)}
        >
          <div
            className="modal-dialog-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog-header">
              <div>
                <h3 className="modal-title-bold">Book Tickets - {movie.title}</h3>
                <p className="modal-sub-details">
                  {movie.certificate} • {movie.language} • {movie.runtime} • {currentCity.city}
                </p>
              </div>
              <button
                className="modal-x-close"
                onClick={() => setShowShowtimesModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="modal-dialog-content">
              {/* Cinema 1 */}
              <div className="cinema-card-unit">
                <h4 className="cinema-title-line">INOX: Vishaal De Mall, Gokhale Road, Madurai</h4>
                <p className="cinema-amenity-line">Laser Projection • Dolby Atmos • Food Pre-order</p>
                <div className="slots-row">
                  <button
                    className="slot-btn"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '10:45 AM')}
                  >
                    10:45 AM
                  </button>
                  <button
                    className="slot-btn fast-filling"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '02:15 PM')}
                  >
                    02:15 PM (Fast Filling)
                  </button>
                  <button
                    className="slot-btn"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '06:30 PM')}
                  >
                    06:30 PM
                  </button>
                  <button
                    className="slot-btn"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '10:00 PM')}
                  >
                    10:00 PM
                  </button>
                </div>
              </div>

              {/* Cinema 2 */}
              <div className="cinema-card-unit">
                <h4 className="cinema-title-line">Cinépolis: Milan'em Mall, Madurai</h4>
                <p className="cinema-amenity-line">VIP Recliners • Dolby 7.1 • M-Ticket Enabled</p>
                <div className="slots-row">
                  <button
                    className="slot-btn"
                    onClick={() => handleBookSlot("Cinépolis Milan'em", '11:30 AM')}
                  >
                    11:30 AM
                  </button>
                  <button
                    className="slot-btn"
                    onClick={() => handleBookSlot("Cinépolis Milan'em", '03:45 PM')}
                  >
                    03:45 PM
                  </button>
                  <button
                    className="slot-btn"
                    onClick={() => handleBookSlot("Cinépolis Milan'em", '07:15 PM')}
                  >
                    07:15 PM
                  </button>
                  <button
                    className="slot-btn"
                    onClick={() => handleBookSlot("Cinépolis Milan'em", '10:45 PM')}
                  >
                    10:45 PM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Trailer Modal */}
      {activeVideo && (
        <div
          className="modal-backdrop-layer"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="video-dialog-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-dismiss-btn"
              onClick={() => setActiveVideo(null)}
            >
              &times;
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && <div className="detail-toast-alert">{toastMessage}</div>}

      {/* Footer */}
      <footer className="detail-footer-bar" role="contentinfo">
        <div className="detail-container footer-inner-row">
          <div className="footer-brand-box">
            <span className="brand-title" style={{ fontSize: '18px' }}>district</span>
            <span>&copy; 2026 District by Zomato Ltd. All rights reserved.</span>
          </div>
          <div className="footer-meta-credit">
            Powered by District by Zomato Design System
          </div>
        </div>
      </footer>
    </div>
  );
}
