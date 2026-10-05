import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import "../components/Styles/BookingTickets.css";

export default function BookingTickets() {
  const [events, setEvents] = useState(null);
  const [Addtocart, setAddtocart] = useState(false);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadError, setLoadError] = useState("");

  const username = sessionStorage.getItem("username") || "";
  const emailaddress = sessionStorage.getItem("emailaddress") || "";
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/BookingTickets/${id}`,
          { withCredentials: true }
        );
        setEvents(response.data.events);
        setAddtocart(response.data.Addtocart);
        setSeats(response.data.seats || 1);
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        setLoadError(
          error.response?.data?.error ||
            "Unable to load event details. Please check your connection."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [id]);

  if (loading) {
    return (
      <div className="containers" style={{ minHeight: "350px" }}>
        <Skeleton
          variant="text"
          width="40%"
          height={40}
          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", mb: 3 }}
        />
        <div
          className="ticket-item"
          style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}
        >
          <div style={{ width: "60%" }}>
            <Skeleton
              variant="text"
              width="80%"
              height={28}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
            />
            <Skeleton
              variant="text"
              width="40%"
              height={20}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.08)", mt: 1 }}
            />
          </div>
          <Skeleton
            variant="rectangular"
            width={120}
            height={36}
            sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: "6px" }}
          />
        </div>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={48}
          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)", borderRadius: "6px", mt: 3 }}
        />
      </div>
    );
  }

  if (loadError || !events) {
    return (
      <div className="containers text-center py-5">
        <h2 className="text-light">Event Not Found</h2>
        <p className="text-light mb-4">
          {loadError || "The event you are trying to book could not be found."}
        </p>
        <Link to="/events" className="btn btn-danger px-4 py-2">
          Browse Other Events
        </Link>
      </div>
    );
  }

  const isSoldOut =
    events.is_sold_out ||
    (events.event_available_seats !== undefined && events.event_available_seats <= 0);
  const maxSeats = Math.min(10, events.event_available_seats || 10);

  const increaseSeats = () => {
    if (seats < maxSeats) {
      setSeats(seats + 1);
      setErrorMessage("");
    } else {
      setErrorMessage(
        events.event_available_seats && events.event_available_seats <= 10
          ? `Only ${events.event_available_seats} seats remaining for this event.`
          : "Maximum 10 tickets per order allowed."
      );
    }
  };

  const decreaseSeats = () => {
    if (seats > 1) {
      setSeats(seats - 1);
      setErrorMessage("");
    }
  };

  const bookingFee = 50;
  const orderAmount = seats * (events.event_price || 0);
  const totalPrice = (orderAmount + bookingFee).toFixed(2);

  const handleAddCart = async () => {
    try {
      const toggle = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/BookingTickets/${id}`,
        {
          params: {
            toggle: 1,
            seats: seats,
          },
          withCredentials: true,
        }
      );
      setEvents(toggle.data.events);
      setAddtocart(toggle.data.Addtocart);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username || !emailaddress) {
      setErrorMessage("Please sign in before booking tickets.");
      navigate(`/Login?next=/BookingTickets/${id}`);
      return;
    }

    if (isSoldOut) {
      setErrorMessage("Sorry, this event is already sold out.");
      return;
    }

    setBookingLoading(true);
    try {
      const csrfResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`,
        { withCredentials: true }
      );
      const csrfToken = csrfResponse.data.csrfToken;

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/BookingTickets/${id}`,
        {
          username: username,
          email: emailaddress,
          seats: seats,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (
        response.data &&
        response.data.booking_details &&
        response.data.booking_details.booking_id
      ) {
        navigate(
          `/BookedConfrimation/${response.data.booking_details.booking_id}`
        );
      } else {
        setErrorMessage("Booking confirmed, but ticket details were missing.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage(
          "An error occurred while confirming your booking. Please try again."
        );
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="containers">
      {errorMessage && (
        <div
          className="alert alert-danger py-2 small mb-3 text-center"
          style={{ borderRadius: "8px" }}
        >
          {errorMessage}
        </div>
      )}

      {!username && (
        <div
          className="alert alert-warning py-2 small mb-3 text-center"
          style={{ borderRadius: "8px" }}
        >
          You are not signed in.{" "}
          <Link
            to={`/Login?next=/BookingTickets/${id}`}
            style={{ fontWeight: "bold", textDecoration: "underline", color: "inherit" }}
          >
            Sign in now
          </Link>{" "}
          to complete your ticket booking.
        </div>
      )}

      {Addtocart ? (
        <>
          <div className="ticket-item">
            <div className="ticket-info">
              <strong>
                {events.event_title} | {events.event_location}
              </strong>
              <p className="text-light">Phase 1 | Fanpit</p>
              <p className="text-light">
                <span id="ticket-count-text">{seats}</span> tickets
              </p>
              {events.event_available_seats !== undefined && (
                <p className="text-muted small" style={{ fontSize: "0.8rem" }}>
                  {events.event_available_seats} seats remaining
                </p>
              )}
            </div>
            <div className="ticket-quantity">
              <button
                type="button"
                id="decrease-btn"
                onClick={decreaseSeats}
                disabled={seats <= 1 || isSoldOut}
                aria-label="Decrease seats"
              >
                -
              </button>
              <span id="ticket-count">{seats}</span>
              <button
                type="button"
                id="increase-btn"
                onClick={increaseSeats}
                disabled={seats >= maxSeats || isSoldOut}
                aria-label="Increase seats"
              >
                +
              </button>
            </div>
            <div className="price-details">
              <div>
                ₹<span id="ticket-price">{events.event_price}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="Addbtn border btn-primary"
            onClick={handleAddCart}
            disabled={isSoldOut}
            style={{ minWidth: "160px" }}
          >
            {isSoldOut ? "SOLD OUT" : "ADD TO CART"}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-light">Order Summary</h2>
          <form method="post" id="booking-form" onSubmit={handleBooking}>
            <div className="ticket-item">
              <div className="ticket-info">
                <strong>
                  {events.event_title} | {events.event_location}
                </strong>
                <p className="text-light">Phase 1 | Fanpit</p>
                <p className="text-light">
                  <span id="ticket-count-text">{seats}</span> tickets
                </p>
                {events.event_available_seats !== undefined && (
                  <p className="text-muted small" style={{ fontSize: "0.8rem" }}>
                    {events.event_available_seats} seats remaining
                  </p>
                )}
              </div>
              <div className="ticket-quantity">
                <button
                  type="button"
                  id="decrease-btn"
                  onClick={decreaseSeats}
                  disabled={seats <= 1 || isSoldOut}
                  aria-label="Decrease seats"
                >
                  -
                </button>
                <span id="ticket-count">{seats}</span>
                <button
                  type="button"
                  id="increase-btn"
                  onClick={increaseSeats}
                  disabled={seats >= maxSeats || isSoldOut}
                  aria-label="Increase seats"
                >
                  +
                </button>
              </div>
              <div className="price-details">
                <div>
                  ₹<span id="ticket-price">{events.event_price}</span>
                </div>
                <input type="hidden" name="seats" id="seats" value={seats} />
              </div>
              <input type="hidden" name="EventId" value={events.event_id} />
              <input type="hidden" name="username" value={username} />
              <input type="hidden" name="email" value={emailaddress} />
            </div>

            <div
              className="offers text-light"
              tabIndex="0"
              onClick={() => alert("Available Offer: Use code EVENT10 for 10% off!")}
              style={{ cursor: "pointer" }}
            >
              View all event offers <i className="fas fa-chevron-right"></i>
            </div>

            <div className="payment-details">
              <div>
                <span className="text-light">Order Amount</span>
                <span className="text-light">
                  ₹<span id="order-amount">{orderAmount}</span>
                </span>
              </div>
              <div>
                <span className="text-light">Booking Fee</span>
                <span className="text-light">₹{bookingFee}</span>
              </div>
              <div className="total">
                <span className="text-light">Order Total</span>
                <span className="text-light">
                  ₹<span id="order-total">{totalPrice}</span>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="Addbtn btn-primary"
              disabled={bookingLoading || isSoldOut}
              style={{ minWidth: "160px" }}
            >
              {isSoldOut
                ? "SOLD OUT"
                : bookingLoading
                ? "CONFIRMING BOOKING..."
                : "CONTINUE"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
