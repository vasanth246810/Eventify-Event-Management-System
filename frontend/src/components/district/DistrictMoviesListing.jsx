import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DistrictMoviesListing.css';

// Featured Movies Carousel Data (Screenshot 1)
const HERO_SLIDES = [
  {
    id: 'sigma',
    title: 'Sigma',
    certificate: 'UA16+',
    genre: 'Action, Drama',
    language: 'Tamil',
    description:
      'Sigma follows a fearless maverick defying all norms to chase grand dreams. This high-octane blend of treasure hunts and heist tension delivers an adventurous mix of action and sharp humor.',
    poster:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    hasBadge: true,
    badgeText: 'Ps',
  },
  {
    id: 'meesaya-murukku-2',
    title: 'Meesaya Murukku 2',
    certificate: 'UA13+',
    genre: 'Musical, Comedy, Drama',
    language: 'Tamil',
    description:
      'The youth anthem returns with energetic beats, campus romance, and unstoppable determination as young artists navigate modern fame.',
    poster:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    hasBadge: false,
  },
  {
    id: 'drishyam-conclusion',
    title: 'Drishyam: The Conclusion',
    certificate: 'UA16+',
    genre: 'Crime, Mystery, Thriller',
    language: 'Tamil',
    description:
      'Georgekutty returns in a gripping battle of wits against investigative scrutiny to shield his family against all consequences.',
    poster:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    hasBadge: false,
  },
  {
    id: 'other-mommy',
    title: 'Other Mommy',
    certificate: 'A',
    genre: 'Psychological Horror, Mystery',
    language: 'English',
    description:
      'A bone-chilling supernatural thriller following an anxious mother confronting uncanny reflections within her child’s nursery.',
    poster:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    hasBadge: false,
  },
];

// This Week's Releases Data (Screenshot 2)
const THIS_WEEKS_RELEASES = [
  {
    id: 'other-mommy-tw',
    title: 'Other Mommy',
    meta: 'A | English',
    poster:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'social-reckoning-tw',
    title: 'The Social Reckoning',
    meta: 'A | English',
    poster:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80',
  },
];

// Only in Theatres 6-Column Grid Data (Screenshot 3)
const THEATRE_MOVIES = [
  {
    id: 'meesaya-murukku-2',
    title: 'Meesaya Murukku 2',
    meta: 'UA13+ | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'anbil-avan',
    title: 'Anbil Avan',
    meta: 'UA16+ | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'doraemon-movie',
    title: 'Doraemon the Movie: New Nobita and the...',
    meta: 'U | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', '3D'],
    poster:
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'hanuman-ansh',
    title: 'Hanuman Ansh',
    meta: 'U | Telugu',
    lang: 'Telugu',
    tags: ['Telugu', '3D', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'mandaadi',
    title: 'Mandaadi',
    meta: 'UA16+ | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'other-mommy',
    title: 'Other Mommy',
    meta: 'A | English',
    lang: 'English',
    tags: ['English', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'drishyam-the-conclusion',
    title: 'Drishyam: The Conclusion',
    meta: 'UA16+ | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', 'Re-Releases'],
    poster:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'sigma',
    title: 'Sigma',
    meta: 'UA16+ | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'social-reckoning',
    title: 'The Social Reckoning',
    meta: 'A | English',
    lang: 'English',
    tags: ['English', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'goat',
    title: 'The Greatest Of All Time',
    meta: 'UA16+ | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', '3D', 'Re-Releases'],
    poster:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'alien-romulus',
    title: 'Alien: Romulus',
    meta: 'A | English',
    lang: 'English',
    tags: ['English', '3D'],
    poster:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'thug-life',
    title: 'Thug Life',
    meta: 'UA16+ | Tamil',
    lang: 'Tamil',
    tags: ['Tamil', 'New Releases'],
    poster:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80',
  },
];

// FAQ Accordion Data (Screenshot 4)
const FAQ_ACCORDIONS = [
  {
    id: 'faq-1',
    title: 'Catch the Trending Blockbusters: Get Your Movie Tickets Now!',
    content:
      'Book the hottest Tamil, Telugu, Hindi, and Hollywood movie tickets in Madurai and across India on District by Zomato with zero hidden convenience fees and instant m-tickets directly on WhatsApp.',
  },
  {
    id: 'faq-2',
    title:
      'Discover Trending Films in Popular Cities & Grab Tickets for the Hottest Releases!',
    content:
      'Explore screenings across major hubs like Madurai, Chennai, Bengaluru, Mumbai, Hyderabad, and Delhi NCR. Enjoy premium formats including IMAX 3D, 4DX, Dolby Atmos, and Laser Projection.',
  },
  {
    id: 'faq-3',
    title: 'Explore the Best Movies Currently Showing in Popular Cities!',
    content:
      'Whether you are catching morning shows, matinees, or late-night screenings, get live seat availability with fast filling alerts to ensure you never miss your favorite corner recliners.',
  },
  {
    id: 'faq-4',
    title: "Top Movie Genres You'll Love – Action, Comedy, Romance & More!",
    content:
      'From pulse-pounding heist thrillers like Sigma and horror sensations like Other Mommy to family adventures with Doraemon, District curates top-rated experiences by audience reviews.',
  },
  {
    id: 'faq-5',
    title:
      'Explore & Book Tickets for Your Favorite Movie Genres in Popular Cities!',
    content:
      'Filter movies instantly by genre, certificate (U, UA, A), language, and experiential cinema technologies. Pre-order gourmet popcorn and snacks at special online discount bundles.',
  },
  {
    id: 'faq-6',
    title: 'Dive into Your Favorite Movie Genres in More Amazing Cities!',
    content:
      'Traveling to another district? Switch your city seamlessly in the top navigation to browse neighborhood cinemas, heritage single screens, and luxury multiplexes anywhere in India.',
  },
  {
    id: 'faq-7',
    title: 'Explore Movies in Your Language Across More Amazing Cities!',
    content:
      'Enjoy regional cinema in Tamil, Malayalam, Telugu, Kannada, Hindi, Marathi, and Bengali subtitles. Book tickets for cultural re-releases and anniversary screenings.',
  },
  {
    id: 'faq-8',
    title: 'Find the Best Cinemas in Popular Cities and cue to popcorn!',
    content:
      'Locate top cinemas like INOX Vishaal De Mall, Cinépolis Milan’em Mall, and Priya Complex. Check show timings, parking facilities, accessibility ramps, and cancellation insurance.',
  },
];

const CITIES = [
  { city: 'Madurai', state: 'Tamil Nadu' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Coimbatore', state: 'Tamil Nadu' },
  { city: 'Bengaluru', state: 'Karnataka' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi-NCR', state: 'Delhi' },
];

export default function DistrictMoviesListing() {
  const navigate = useNavigate();

  // Location State
  const [cityIndex, setCityIndex] = useState(0);
  const currentCity = CITIES[cityIndex];

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter State
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion State (single open item or null)
  const [openAccordion, setOpenAccordion] = useState(null);

  // Modal State
  const [modalMovie, setModalMovie] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3200);
  };

  const handleCityToggle = () => {
    const next = (cityIndex + 1) % CITIES.length;
    setCityIndex(next);
    showToast(`Location set to ${CITIES[next].city}, ${CITIES[next].state}`);
  };

  const handleFilterClick = (tag) => {
    if (activeFilter === tag) {
      setActiveFilter(null);
    } else {
      setActiveFilter(tag);
    }
  };

  // Filtered theatre movies
  const filteredTheatreMovies = useMemo(() => {
    return THEATRE_MOVIES.filter((m) => {
      const matchTag =
        !activeFilter ||
        m.tags.includes(activeFilter) ||
        m.lang === activeFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.lang.toLowerCase().includes(q);
      return matchTag && matchSearch;
    });
  }, [activeFilter, searchQuery]);

  const activeHero = HERO_SLIDES[currentSlide];

  const handleBookSlot = (cinema, time) => {
    setModalMovie(null);
    showToast(`Selected ${time} at ${cinema}! Redirecting to seat layout...`);
    // Optional navigation to seat picker or buy-page
    setTimeout(() => {
      navigate('/buy-page');
    }, 1200);
  };

  return (
    <div className="district-movies-app">
      {/* ========================================================
          TOP NAVIGATION HEADER (SCREENSHOT 1)
          ======================================================== */}
      <header className="district-header" role="banner">
        <div className="district-container header-inner">
          {/* Brand & Location */}
          <div className="brand-location-cluster">
            <Link to="/movies" className="brand-logo-group" aria-label="District by Zomato Home">
              <span className="brand-logo-name">district</span>
              <span className="brand-logo-sub">BY ZOMATO</span>
            </Link>

            <button
              className="location-pill-btn"
              onClick={handleCityToggle}
              title="Click to switch city"
              aria-label={`Current location: ${currentCity.city}, ${currentCity.state}`}
            >
              <svg
                className="loc-pin-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div className="loc-text-col">
                <span className="loc-city">{currentCity.city}</span>
                <span className="loc-state">{currentCity.state}</span>
              </div>
            </button>

            {/* Verticals Navigation */}
            <nav className="vertical-nav-links" aria-label="District Verticals">
              <Link to="/home" className="v-nav-item">
                For you
              </Link>
              <Link to="/home" className="v-nav-item">
                Dining
              </Link>
              <Link to="/movies" className="v-nav-item active">
                Movies
              </Link>
              <Link to="/events" className="v-nav-item">
                Events
              </Link>
            </nav>
          </div>

          {/* Search & Profile */}
          <div className="header-search-profile">
            <div className="search-pill-wrapper" role="search">
              <svg
                className="search-lens-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search for events, movies and restaurants"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search movies"
              />
            </div>

            <button
              className="user-profile-circle-btn"
              onClick={() => navigate('/profile')}
              aria-label="Account Profile"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          FLOATING RIGHT SIDEBAR CONTROLS (SCREENSHOTS 1, 2, 4)
          ======================================================== */}
      <aside className="floating-action-column" aria-label="Quick actions">
        <button
          className="float-btn dark"
          onClick={() => showToast('No new notifications')}
          title="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button
          className="float-btn dark"
          onClick={() => showToast('Movie saved to Watchlist')}
          title="Wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button
          className="float-btn purple"
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
          HERO CAROUSEL: "SIGMA" (SCREENSHOT 1)
          ======================================================== */}
      <section className="hero-spotlight-carousel" aria-label="Hero Spotlight Movie">
        {/* Ambient Blur Backdrop */}
        <div
          className="hero-ambient-backdrop"
          style={{ backgroundImage: `url(${activeHero.poster})` }}
        ></div>

        <div className="district-container hero-position-container">
          {/* Previous Arrow */}
          <button
            className="carousel-chevron-btn prev"
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
            }
            aria-label="Previous Spotlight"
          >
            &lt;
          </button>

          <div className="hero-content-split">
            {/* Left Movie Info */}
            <div className="hero-details-pane">
              <h1 className="hero-feature-title">{activeHero.title}</h1>
              <div className="hero-meta-strip">
                <span>{activeHero.certificate}</span>
                <span className="meta-sep">|</span>
                <span>{activeHero.genre}</span>
              </div>
              <p className="hero-synopsis-copy">{activeHero.description}</p>
              <button
                className="btn-book-now-pill"
                onClick={() =>
                  setModalMovie({
                    title: activeHero.title,
                    meta: `${activeHero.certificate} • ${activeHero.genre}`,
                  })
                }
              >
                Book now
              </button>
            </div>

            {/* Right Poster */}
            <div className="hero-poster-pane">
              <div
                className="hero-poster-frame"
                onClick={() =>
                  setModalMovie({
                    title: activeHero.title,
                    meta: `${activeHero.certificate} • ${activeHero.genre}`,
                  })
                }
              >
                {activeHero.hasBadge && <span className="poster-ps-badge">Ps</span>}
                <img
                  src={activeHero.poster}
                  alt={`${activeHero.title} Poster`}
                  className="hero-poster-image"
                />
              </div>
            </div>
          </div>

          {/* Next Arrow */}
          <button
            className="carousel-chevron-btn next"
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
            }
            aria-label="Next Spotlight"
          >
            &gt;
          </button>

          {/* Indicator Dots */}
          <div className="carousel-dot-row">
            {HERO_SLIDES.map((_, idx) => (
              <span
                key={idx}
                className={`carousel-dot-item ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          THIS WEEK'S RELEASES (SCREENSHOT 2)
          ======================================================== */}
      <section className="this-weeks-releases-section">
        <div className="district-container">
          <h2 className="section-title-bold">This Week's Releases</h2>

          <div className="releases-horizontal-scroll">
            {THIS_WEEKS_RELEASES.map((m) => (
              <div
                key={m.id}
                className="weekly-release-card"
                onClick={() =>
                  setModalMovie({ title: m.title, meta: m.meta })
                }
              >
                <div className="weekly-poster-wrapper">
                  <img src={m.poster} alt={m.title} className="weekly-poster-image" />
                </div>
                <h3 className="weekly-card-title">{m.title}</h3>
                <p className="weekly-card-meta">{m.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          ONLY IN THEATRES: 6-COLUMN GRID (SCREENSHOTS 2 & 3)
          ======================================================== */}
      <section className="only-in-theatres-section">
        <div className="district-container">
          <h2 className="section-title-bold">Only in Theatres</h2>

          {/* Filter Pills Bar */}
          <div className="theatres-filter-bar" role="group" aria-label="Movie filters">
            <button
              className="filter-pill-action"
              onClick={() => {
                setActiveFilter(null);
                setSearchQuery('');
              }}
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

            {['Tamil', 'English', 'New Releases', 'Re-Releases', '3D'].map((tag) => (
              <button
                key={tag}
                className={`filter-pill-tag ${activeFilter === tag ? 'active' : ''}`}
                onClick={() => handleFilterClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 6-Column Grid */}
          <div className="six-column-theatres-grid">
            {filteredTheatreMovies.length > 0 ? (
              filteredTheatreMovies.map((m) => (
                <div
                  key={m.id}
                  className="theatre-movie-item"
                  onClick={() => {
                    if (m.id === 'anbil-avan') {
                      navigate('/movies/anbil-avan-movie-tickets-MV231011');
                    } else {
                      navigate(`/movies/detail/${m.id}`);
                    }
                  }}
                >
                  <div className="theatre-poster-holder">
                    <img src={m.poster} alt={m.title} className="theatre-poster-pic" />
                  </div>
                  <h3 className="theatre-item-title" title={m.title}>
                    {m.title}
                  </h3>
                  <p className="theatre-item-meta">{m.meta}</p>
                </div>
              ))
            ) : (
              <div className="no-movies-match-box">
                <p>No movies match your filter criteria.</p>
                <button
                  className="btn-clear-filters"
                  onClick={() => {
                    setActiveFilter(null);
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          SEO & FAQ ACCORDION SHELF (SCREENSHOT 4)
          ======================================================== */}
      <section className="faq-accordions-section">
        <div className="district-container">
          <div className="accordions-vertical-list">
            {FAQ_ACCORDIONS.map((faq) => {
              const isOpen = openAccordion === faq.id;
              return (
                <div key={faq.id} className={`faq-card-unit ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-card-header"
                    onClick={() => setOpenAccordion(isOpen ? null : faq.id)}
                  >
                    <span>{faq.title}</span>
                    <svg
                      className="faq-chevron-arrow"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {isOpen && <div className="faq-card-body">{faq.content}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          SHOWTIMES QUICK BOOKING MODAL
          ======================================================== */}
      {modalMovie && (
        <div
          className="showtimes-modal-backdrop"
          onClick={() => setModalMovie(null)}
        >
          <div
            className="showtimes-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top-bar">
              <div>
                <h3 className="modal-feature-title">{modalMovie.title}</h3>
                <p className="modal-feature-subtitle">{modalMovie.meta}</p>
              </div>
              <button
                className="modal-dismiss-btn"
                onClick={() => setModalMovie(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-shows-body">
              {/* Cinema 1 */}
              <div className="cinema-timing-block">
                <div className="cinema-name-tag">INOX: Vishaal De Mall, Gokhale Road, Madurai</div>
                <div className="cinema-features-tag">Dolby 7.1 • Laser Projection • Instant M-Tickets</div>
                <div className="slots-chip-flex">
                  <button
                    className="slot-time-btn"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '10:45 AM')}
                  >
                    10:45 AM
                  </button>
                  <button
                    className="slot-time-btn fast-filling"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '02:15 PM')}
                  >
                    02:15 PM (Fast Filling)
                  </button>
                  <button
                    className="slot-time-btn"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '06:30 PM')}
                  >
                    06:30 PM
                  </button>
                  <button
                    className="slot-time-btn"
                    onClick={() => handleBookSlot('INOX Vishaal De Mall', '10:00 PM')}
                  >
                    10:00 PM
                  </button>
                </div>
              </div>

              {/* Cinema 2 */}
              <div className="cinema-timing-block">
                <div className="cinema-name-tag">Cinépolis: Milan'em Mall, Madurai</div>
                <div className="cinema-features-tag">Dolby Atmos • VIP Recliners • F&B Pre-orders</div>
                <div className="slots-chip-flex">
                  <button
                    className="slot-time-btn"
                    onClick={() => handleBookSlot("Cinépolis Milan'em", '11:30 AM')}
                  >
                    11:30 AM
                  </button>
                  <button
                    className="slot-time-btn"
                    onClick={() => handleBookSlot("Cinépolis Milan'em", '03:45 PM')}
                  >
                    03:45 PM
                  </button>
                  <button
                    className="slot-time-btn"
                    onClick={() => handleBookSlot("Cinépolis Milan'em", '07:15 PM')}
                  >
                    07:15 PM
                  </button>
                  <button
                    className="slot-time-btn"
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

      {/* Toast Feedback */}
      {toastMessage && <div className="district-toast-notice">{toastMessage}</div>}

      {/* ========================================================
          DISTRICT FOOTER
          ======================================================== */}
      <footer className="district-footer-bar" role="contentinfo">
        <div className="district-container footer-inner-row">
          <div className="footer-left-brand">
            <span className="brand-logo-name" style={{ fontSize: '18px' }}>district</span>
            <span>&copy; 2026 District by Zomato. All rights reserved.</span>
          </div>
          <div className="footer-right-credit">
            Powered by District Design System • Madurai
          </div>
        </div>
      </footer>
    </div>
  );
}
