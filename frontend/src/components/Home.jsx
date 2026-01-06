import '../components/Styles/Home.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/`);
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  const today = new Date();
  const upcomingEvents = events.filter(event => new Date(event.event_scheduled_date) > today);
  const popularEvents = events.filter(event => event.event_title.toLowerCase().includes(searchTerm.toLowerCase())); // Filter popular events by search
  const filteredUpcomingEvents = upcomingEvents.filter(event => event.event_title.toLowerCase().includes(searchTerm.toLowerCase())); // Filter upcoming by search

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    if (upcomingEvents.length > 0) {
      const nextEvent = upcomingEvents.sort((a, b) => new Date(a.event_scheduled_date) - new Date(b.event_scheduled_date))[0];
      const eventDate = new Date(nextEvent.event_scheduled_date).getTime();

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [upcomingEvents]);

  // Categories Filter
  const categories = [ "Music", "Comedy", "Sports", "Theater"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filterByCategory = (events) => {
    if (selectedCategory === "All") return events;
    return events.filter(event => event.event_title.toLowerCase().includes(selectedCategory.toLowerCase()));
  };

  const filteredUpcoming = filterByCategory(filteredUpcomingEvents);
  const filteredPopular = filterByCategory(popularEvents);
  return (
    <>
      {/* header-start */}
      <header>
        <div className="header-area ">
          <div id="sticky-header" className="main-header-area">
            <div className="container">
              <div className="header_bottom_border">
                <div className="row align-items-center">
                  <div className="col-xl-3 col-lg-3">
                    
                  </div>
                  <div className="col-xl-6 col-lg-6">
                    <div className="main-menu  d-none d-lg-block">
                      <nav>
                        <ul id="navigation">
                          <li><a href="index.html">home</a></li>
                          <li><a href="performer.html">Performer</a></li>
                          
                          <li><a href="#">pages <i className="ti-angle-down"></i></a>
                            <ul className="submenu">
                              <li><a href="about.html">about</a></li>
                              <li><a href="Program.html">Program</a></li>
                              <li><a href="Venue.html">Venue</a></li>
                              <li><a href="elements.html">elements</a></li>
                            </ul>
                          </li>
                          <li><a href="#">blog <i className="ti-angle-down"></i></a>
                            <ul className="submenu">
                              <li><a href="blog.html">blog</a></li>
                              <li><a href="single-blog.html">single-blog</a></li>
                            </ul>
                          </li>
                          <li><a href="contact.html">Contact</a></li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 d-none d-lg-block">
                    <div className="buy_tkt">
                      <div className="book_btn d-none d-lg-block">
                        <a href="#">Buy Tickets</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mobile_menu d-block d-lg-none"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* header-end */}

      {/* slider_area_start */}
      <div className="slider_area">
        {/* <video autoPlay muted loop className="video-background">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <div className="single_slider  d-flex align-items-center slider_bg_1 overlay">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-xl-12">
                <div className="slider_text text-center">
                  <div className="shape_1 wow fadeInUp" data-wow-duration="1s" data-wow-delay=".2s">
                    <img src="img/shape/shape_1.svg" alt="" />
                  </div>
                  <div className="shape_2 wow fadeInDown" data-wow-duration="1s" data-wow-delay=".2s">
                    <img src="img/shape/shape_2.svg" alt="" />
                  </div>
                  <span className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".3s">12 Feb, 2020</span>
                  <h3 className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".4s">Eventify</h3>
                  <p className="wow fadeInLeft" data-wow-duration="1s" data-wow-delay=".5s">Green Avenue, New York</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* slider_area_end */}

      {/* Hero Stats Section */}
      <div className="hero-stats-section py-5" style={{ backgroundColor: '#000', color: '#fff' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-3 text-center">
              <h3 className="stat-number">{events.length}+</h3>
              <p className="stat-label">Total Events</p>
            </div>
            <div className="col-md-3 text-center">
              <h3 className="stat-number">{upcomingEvents.length}+</h3>
              <p className="stat-label">Upcoming Events</p>
            </div>
            <div className="col-md-3 text-center">
              <h3 className="stat-number">1000+</h3>
              <p className="stat-label">Happy Customers</p>
            </div>
            <div className="col-md-3 text-center">
              <h3 className="stat-number">4.9★</h3>
              <p className="stat-label">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer Section */}
      {upcomingEvents.length > 0 && (
        <div className="countdown-section py-5" style={{ backgroundColor: '#111', color: '#fff' }}>
          <div className="container">
            <h2 className="text-center mb-4">Next Event Countdown</h2>
            <div className="row justify-content-center">
              <div className="col-md-2 text-center countdown-item">
                <h2>{timeLeft.days}</h2>
                <p>Days</p>
              </div>
              <div className="col-md-2 text-center countdown-item">
                <h2>{timeLeft.hours}</h2>
                <p>Hours</p>
              </div>
              <div className="col-md-2 text-center countdown-item">
                <h2>{timeLeft.minutes}</h2>
                <p>Minutes</p>
              </div>
              <div className="col-md-2 text-center countdown-item">
                <h2>{timeLeft.seconds}</h2>
                <p>Seconds</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar and Categories Filter */}
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search events or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <i
                  className="fas fa-times clear-icon"
                  onClick={() => setSearchTerm('')}
                ></i>
              )}
              <i className="fas fa-search search-icon"></i>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-3">
          <div className="col-md-8">
            <div className="d-flex justify-content-center flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn mx-2 ${selectedCategory === category ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="container py-5">
        <h2 className="text-center mb-4" style={{ color: '#fff' }}>Upcoming Events</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {upcomingEvents.slice(0, 4).map((event, index) => (
            <div className="col" key={event.event_id}>
              <div className="card shadow-sm fade-in-card" style={{ width:"260px",borderRadius: "16px", borderColor: "#ff2c55", animationDelay: `${index * 0.2}s`, minWidth: 0 }}>
                <Link to={`/event-list/${event.event_id}`}>
                  <img src={event.event_image} className="card-img-top rounded" style={{ height: "200px", objectFit: "cover" }} alt={event.event_title} />
                </Link>
                <div className="card-body">
                  <p className="card-text text-light fs-6">{new Date(event.event_scheduled_date).toLocaleString()}</p>
                  <h5 className="card-title fw-bold text-light">{event.event_title}</h5>
                  <p className="card-text fw-semibold text-light">₹{event.event_price}</p>
                </div> 
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Events Section */}
      <div className="container py-5">
        <h2 className="text-center mb-4" style={{ color: '#fff' }}>Popular Events</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {popularEvents.slice(0, 4).map((event) => (
            <div className="col" key={event.event_id}>
              <div className="card shadow-sm" style={{ borderRadius: "16px", borderColor: "#ff2c55", width: "260px" }}>
                <Link to={`/event-list/${event.event_id}`}>
                  <img src={event.event_image} className="card-img-top rounded" style={{ height: "200px", objectFit: "cover" }} alt={event.event_title} />
                </Link>
                <div className="card-body">
                  <p className="card-text text-light fs-6">{new Date(event.event_scheduled_date).toLocaleString()}</p>
                  <h5 className="card-title fw-bold text-light">{event.event_title}</h5>
                  <p className="card-text fw-semibold text-light">₹{event.event_price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="social-media-section py-5" style={{ backgroundColor: '#000', color: '#fff' }}>
        <div className="container text-center">
          <h4>Follow Us</h4>
          <div className="d-flex justify-content-center mt-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-3" style={{ color: '#ff2c55', fontSize: '24px' }}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-3" style={{ color: '#ff2c55', fontSize: '24px' }}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-3" style={{ color: '#ff2c55', fontSize: '24px' }}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="mx-3" style={{ color: '#ff2c55', fontSize: '24px' }}>
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

    </>
  );
}
