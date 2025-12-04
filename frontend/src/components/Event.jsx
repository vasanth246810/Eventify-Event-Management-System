import axios from 'axios';
import { useState,useEffect } from 'react';
import "../components/Styles/Event.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Event(){
    const[events,setEvents]=useState([]);
    const[Artists,setArtists]=useState([]);
    const [activeButtons, setActiveButton] = useState([]);  
    const [filterOpen, setFilterOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);


useEffect(() => {

  const fetchEvents = async () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events/`)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => console.error(error));
  };

  const fetchArtists = async () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/artists/`)
      .then(response => {
        setArtists(response.data);
        console.log("Artists State:", response.data);
      })
      .catch(error => console.error(error));
  };

  fetchEvents();
  fetchArtists();

  const updateSize = () => setIsMobile(window.innerWidth < 840);
  updateSize();
  window.addEventListener("resize", updateSize);
  return () => window.removeEventListener("resize", updateSize);

}, []);


const handleClick = async (index) => {
  if (index === 0) {
    setFilterOpen(!filterOpen);
  }

  let updated = [...activeButtons];

  if (updated.includes(index)) {
    updated = updated.filter((i) => i !== index);
  } else {
    updated.push(index);
  }

  setActiveButton(updated);

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/events/filter/`, {
      filters: updated,
    });
    setEvents(response.data);
  } catch (error) {
    console.log(error);
  }
};

  const buttonNames = ["Filter", "Today", "Tommorow", "10KM"];

    return(
 <div style={{marginTop: "70px"}}>
     <div className="Event-container">
      {/* Hero Section */}
      <div className="hero-section text-center mb-5">
        <h1 className="Eventhero-title">Discover Amazing Events</h1>
        <p className="hero-subtitle">
          Find and book extraordinary experiences that create lasting memories.
          From intimate gatherings to grand celebrations, discover events that inspire and connect.
        </p>
        <div className="hero-stats d-flex justify-content-center gap-5 mt-4">
          <div className="stat-item text-center">
            <span className="stat-number-events">{events.length}+</span>
            <span className="stat-label-events">Live Events</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number-events">1000+</span>
            <span className="stat-label-events">Happy Customers</span>
          </div>
          <div className="stat-item text-center">
            <span className="stat-number-events">4.9★</span>
            <span className="stat-label-events">Rating</span>
          </div>
        </div>
      </div>
      {/* Events Carousel */}
      {events.length > 0 ? (
        // <div id="eventCarousel" className="carousel slide" data-bs-ride="carousel">
        //   <div className="carousel-inner">
        //     {events.map((event, index) => (
        //       <div key={event.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
        //         <div
        //           className="position-relative d-flex align-items-center justify-content-center"
        //           style={{ minHeight: "100vh", cursor: "pointer" }}
        //         >
        //           {/* Blurred Background */}
        //           <div className="position-absolute top-0 start-0 w-100 h-100 blurimage">
        //             <div  style={{
        //                   backgroundImage: `url(${event.event_image})`,
        //                   backgroundSize: "cover",
        //                   backgroundPosition: "center",
        //                   width: "100%",
        //                   height: "100%",
        //                 }}></div>
        //           </div>

        //           {/* Foreground */}
        //           <div className="position-relative text-white" style={{ maxWidth: "1140px", width: "100%", margin: "auto", padding: "0 1.5rem" }}>
        //             <div className="row align-items-center">
        //               {/* Left: Event Details */}
        //               <div className="col-md-6">
        //                 <p className="mb-2 fs-5 fw-semibold ">
        //                   {new Date(event.event_scheduled_date).toLocaleString()}
        //                 </p>
        //                 <h2 className="lh-sm fs-2 fw-bold ">{event.event_title}</h2>
        //                 <h4 className="fs-5 fw-bold ">₹{event.event_price}</h4>
        //                 <Link to={`/event-list/${event.event_id}`}>
        //                 <button
        //                   className="btn fs-5 mt-3 p-3 px-5 text-white"
        //                   style={{ width: "200px", height: "64px", borderRadius: "16px", background: "#ff2c55", border: "2px solid #ff2c55" }}
        //                 >
        //                   Book Now
        //                 </button>
        //                 </Link>
        //               </div>

        //               {/* Right: Event Image */}
        //               <div className="col-md-6 text-center">
        //                 <img
        //                   src={event.event_image}
        //                   alt={event.event_title}
        //                   className="img-fluid shadow rounded-4"
        //                   style={{ width: "334px", height: "445px", objectFit: "cover" }}
        //                 />
        //               </div>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     ))}
        //   </div>

        //   {/* Carousel Controls */}
        //   <button className="carousel-control-prev" type="button" data-bs-target="#eventCarousel" data-bs-slide="prev">
        //     <span className="carousel-control-prev-icon px-2" aria-hidden="true"></span>
        //   </button>
        //   <button className="carousel-control-next" type="button" data-bs-target="#eventCarousel" data-bs-slide="next">
        //     <span className="carousel-control-next-icon px-2" aria-hidden="true"></span>
        //   </button>
        // </div>
        <>
          {/* DESKTOP VIEW (≥ 840px) */}
    {!isMobile && (
      <div id="eventCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {events.map((event, index) => (
            <div key={event.event_id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <div className="position-relative d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", cursor: "pointer" }}>
                
                {/* Blurred BG */}
                <div className="position-absolute top-0 start-0 w-100 h-100 blurimage">
                  <div style={{
                    backgroundImage: `url(${event.event_image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                  }}></div>
                </div>

                {/* Foreground */}
                <div className="position-relative text-white" style={{ maxWidth: "1140px", width: "100%", margin: "auto", padding: "0 1.5rem" }}>
                  <div className="row align-items-center">
                    
                    {/* Left Content */}
                    <div className="col-md-6">
                      <p className="mb-2 fs-5 fw-semibold">
                        {new Date(event.event_scheduled_date).toLocaleString()}
                      </p>
                      <h2 className="lh-sm fs-2 fw-bold">{event.event_title}</h2>
                      <h4 className="fs-5 fw-bold">₹{event.event_price}</h4>
                      <Link to={`/event-list/${event.event_id}`}>
                        <button className="btn fs-5 mt-3 p-3 px-5 text-white"
                          style={{ width: "200px", height: "64px", borderRadius: "16px", background: "#ff2c55", border: "2px solid #ff2c55" }}>
                          Book Now
                        </button>
                      </Link>
                    </div>

                    {/* Right Image */}
                    <div className="col-md-6 text-center">
                      <img src={event.event_image} alt={event.event_title} className="img-fluid shadow rounded-4"
                        style={{ width: "334px", height: "445px", objectFit: "cover" }} />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#eventCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon px-2"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#eventCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon px-2"></span>
        </button>
      </div>
    )}

    {/* MOBILE VIEW (< 840px) */}
    {isMobile && (
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1.15}
        className="mobile-swiper"
      >
        {events.map((event) => (
          <SwiperSlide key={event.event_id}>
            <div className="card shadow-sm" style={{borderRadius:"16px", width:"100%",borderColor:"#ff2c55"}}>
              <Link to={`/event-list/${event.event_id}`}>
                <img src={event.event_image} className="card-img-top rounded" style={{height:"260px", objectFit:"cover"}}/>
              </Link>
              <div className="card-body">
                <p className="text-light">{new Date(event.event_scheduled_date).toLocaleString()}</p>
                <h5 className="fw-bold text-light">{event.event_title}</h5>
                <p className="fw-semibold text-light">₹{event.event_price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    )}
        </>
      ) : (
        // Empty State
        <div className="empty-state-events mt-5 text-center p-5 rounded-3 shadow">
          <h2 className="empty-title">No Events Available</h2>
          <p className="empty-subtitle">
            We're preparing amazing experiences for you. Check back soon to discover incredible events.
          </p>
        </div>
      )}
    </div>

    <div className="events-container">
    <div className="artists-section mb-5">
        <h2 className="text-center mb-4">Featured Artists</h2>
        <div className="d-flex justify-content-center">
            {Artists.map((artists)=>(
               <div className="col-auto" key={artists.artistid}>
                <Link to={`/artists/${artists.ArtistName}`} style={{textDecoration:"none",color:"inherit"}}>
                  <div className="artist-circle me-4">
                      <img src={artists.Artist_image} alt={artists.ArtistName} className="rounded-circle" width="190" height="190"/>
                      <p className="text-center mt-2 fw-bold">{artists.ArtistName}</p>
                  </div>
                </Link>
            </div>
            ))}
        </div>
    </div>
    <div className="events-header">
        <h1 className="events-title">All Events</h1>
        <p className="events-subtitle">Discover amazing experiences happening around you</p>
    </div>
    <div className='d-flex gap-2 align-items-center justify-content-center' >
      {buttonNames.map((name, index) => (
         <button
            className={`FilterButton ${activeButtons.includes(index) ? "active" : ""}`}
            onClick={() => handleClick(index)}
          >
            {name}
          </button>
      ))}
    </div>

{events.length > 0 ? (
 <div className="container py-4">
  <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
    {events.map((event, index) => (
      <div className="col" key={event.event_id}>
        <div className="card shadow-sm " style={{borderRadius: "16px", width: "100%", maxWidth: "304px", margin: "auto",borderColor:"#ff2c55"}}>
          <a href={`/event-list/${event.event_id}`}>
            <img src={event.event_image} className="card-img-top rounded" style={{maxWidth: "302px", height: "420px", objectFit: "cover"}} alt={event.event_title}/>
          </a>

          <div className="card-body d-flex flex-column justify-content-between">
            <p className="card-text text-light fs-6 fw-medium">{new Date(event.event_scheduled_date).toLocaleString()}</p>
            <h5 className="fw-bolder fs-6 overflow-hidden text-wrap lh-sm my-0 text-light">{event.event_title}</h5>
            <p className="fs-6 fw-semibold overflow-hidden text-wrap my-0 text-light">₹{event.event_price}</p>
          </div>
        </div>
      </div>
      ))}
  </div>
</div>
   ):( 
        <div className="empty-state-events mt-5 text-center p-5 rounded-3 shadow">
            <h2 className="empty-title">No Events Available</h2>
            <p className="empty-subtitle">
                We're preparing amazing experiences for you. Check back soon to discover incredible events.
            </p>
        </div>
      )}
</div>

    </div>
    );
}
