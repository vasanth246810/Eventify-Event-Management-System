import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ArtistInfo() {
  const { name } = useParams();                   // get name from URL
  const [artist, setArtist] = useState(null);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/artists/${name}`)
      .then(response => setArtist(response.data))
      .catch(error => console.error(error));
  }, [name]);

  if (!artist) return <p>Loading...</p>;

  // Debug: log the image URL

  return (
<div style={{ maxWidth: "1284px", margin: "auto", padding: "20px" }}>
      {/* Header Section */}
      <div style={{ display: "flex", gap: "65px", alignItems: "flex-start" }}>
        {/* Image Hero */}
        <div style={{ flex: "0 0 350px" }}>
          <div
            style={{
              backgroundImage: `url(${artist.artist_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "520px",
              height: "520px",
              borderRadius: "12px"
            }}
          />
        </div>

        {/* Text block */}
        <div style={{ width: "652px", height: "768px", overflowY: "visible" }}>
          <h1 style={{color:"#ff2c55"}}>{artist.artistname}</h1>
          <p className="text-light" style={{whiteSpace: "pre-line"}}>{artist.description || "Description not available."}</p>
        </div>
      </div>

      {/* Events Section */}
      <section style={{ marginTop: "40px" }}>
        <h2 style={{color:"#ff2c55"}}>All Events</h2>
         <div className="container py-4">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {artist.events.map((event, index) => (
                <div className="col" key={event.event_id}>
                  <div className="card shadow-sm " style={{borderRadius: "16px", width: "100%", maxWidth: "304px", height: "543px", margin: "auto",borderColor:"#ff2c55"}}>
                    <a href={`/event-list/${event.event_id}`}>
                      <img src={event.event_image_url} className="card-img-top rounded" style={{maxWidth: "302px", height: "420px", objectFit: "cover"}} alt={event.event_title}/>
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
      </section>
    </div>  );
}
