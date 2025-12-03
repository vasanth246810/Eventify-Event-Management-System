import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, FileText, Monitor, Film, CreditCard, Gift, LogOut, X, Edit2, Check } from 'lucide-react';
import "../components/Styles/Profile.css"

export default function AccountProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [identity, setIdentity] = useState('');
  const [emailVerified] = useState(true);
  // const email = 'vasanthkumar49480@gmail.com';
  
  const [addressType, setAddressType] = useState('home');
  const [addressFirstName, setAddressFirstName] = useState('');
  const [addressLastName, setAddressLastName] = useState('');
  const [addressEmail, setAddressEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [userDetails, setUserDeatils] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: ""
  });

const [activeButtons,setActiveButtons]=useState('profile')
const [bookings,setBookings]=useState([])

// console.log(activeButtons)

  useEffect(()=>{
    const fetchdata=async()=>{
      try{
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/profile/`, { withCredentials: true });
        setUserDeatils(response.data.user);
        setBookings(response.data.bookings);
        console.log(response.data.bookings)
        // Populate form fields with fetched data
      }
      catch(error){
        console.error(error.response ? error.response.data : error.message);
      }
    }
    fetchdata();
  },[])

  return (
    <>

      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      
      <div className="main-container">
        <div className="content-wrapper">
          <div className="d-flex gap-3">
            {/* Sidebar */}
            <div className="sidebar">
              <div className="sidebar-header">
                <h2 className="sidebar-title">My Account</h2>
              </div>

              <ul className="sidebar-menu">
                <li className="sidebar-menu-item">
                  <button className={`sidebar-btn ${ activeButtons ==="profile" ? "active":""}`} onClick={()=>setActiveButtons('profile')}>
                    <User size={20} />
                    <span>Profile</span>
                  </button>
                </li>
                <li className="sidebar-menu-item">
                  <button className={`sidebar-btn ${ activeButtons ==="orders" ? "active":""}`} onClick={()=>setActiveButtons('orders')}>
                    <FileText size={20} />
                    <span>Your Orders</span>
                  </button>
                </li>
              </ul>
            </div>
          { activeButtons ==="profile" && (
            <div className="profile-content">
              <div className="profile-header">
                <div className="profile-avatar">
                  {/* <User size={178} /> */}
                  <img src={userDetails.profile_image} height="178" width="178" />
                </div>
                <div className="flex-grow-1 m-auto">
                  <h1 className="profile-name">{userDetails.username}</h1>
                </div>
              </div>

              {/* Account Details */}
              <div className="mb-4">
                <h2 className="section-title">Account Details</h2>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="label-header">
                      <label className="form-label-custom">Mobile Number</label>
                    </div>
                    <input
                      type="text"
                      placeholder="Number"
                      className="form-control-custom"
                    />
                  </div>

                  <div className="col-md-6">
                    <div className="label-header">
                      <label className="form-label-custom">Email Address</label>
                    </div>
                    <div className="input-with-icon">
                      <input
                        type="email"
                        value={userDetails.email}
                        readOnly
                        className="form-control-custom"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="mb-4">
                <h2 className="section-title">Personal Details</h2>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">
                      First Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter first name here"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control-custom"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter last name here"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-control-custom"
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">
                      Birthday (Optional)
                    </label>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="form-control-custom"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">
                      Identity (Optional)
                    </label>
                    <div className="gender-buttons">
                      <button
                        onClick={() => setIdentity('male')}
                        className={`btn-option ${identity === 'male' ? 'active' : ''}`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setIdentity('female')}
                        className={`btn-option ${identity === 'female' ? 'active' : ''}`}
                      >
                        Female
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="section-divider">
                  <h2 className="section-title">Address</h2>
                  
                  <div className="mb-3">
                    <label className="form-label-custom">
                      Save As<span className="required">*</span>
                    </label>
                    <div className="address-type-buttons">
                      <button
                        onClick={() => setAddressType('home')}
                        className={`btn-option ${addressType === 'home' ? 'active' : ''}`}
                      >
                        Home
                      </button>
                      <button
                        onClick={() => setAddressType('work')}
                        className={`btn-option ${addressType === 'work' ? 'active' : ''}`}
                      >
                        Work
                      </button>
                      <button
                        onClick={() => setAddressType('other')}
                        className={`btn-option ${addressType === 'other' ? 'active' : ''}`}
                      >
                        Other
                      </button>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        First Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter First Name"
                        value={addressFirstName}
                        onChange={(e) => setAddressFirstName(e.target.value)}
                        className="form-control-custom"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        Last Name <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Last Name"
                        value={addressLastName}
                        onChange={(e) => setAddressLastName(e.target.value)}
                        className="form-control-custom"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        Email ID <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="Enter Email ID"
                        value={addressEmail}
                        onChange={(e) => setAddressEmail(e.target.value)}
                        className="form-control-custom"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        Mobile Number <span className="required">*</span>
                      </label>
                      <div className="input-group-custom">
                        <span className="input-group-text-custom">+91</span>
                        <input
                          type="tel"
                          placeholder="Enter Mobile Number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="form-control-custom"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label-custom">
                      Address Line 1 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Address Line 1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="form-control-custom"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label-custom">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Address Line 2"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="form-control-custom"
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Landmark"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="form-control-custom"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        Pin Code <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Pin Code"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className="form-control-custom"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        City <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="form-control-custom"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-custom">
                        State <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="form-control-custom"
                      />
                    </div>
                  </div>

                  <div className="footer-actions">
                    <p className="terms-text">
                      By proceeding, I agree to{' '}
                      <a href="#">Terms & Conditions</a>{' '}
                      and{' '}
                      <a href="#">Privacy Policy</a>
                    </p>
                    <button className="btn-save">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
           
           )}
          {activeButtons === 'orders' &&(
            <div className="orders-container" style={{minWidth:"940px"}}>
              <h1 className="section-title">Your Bookings</h1>
              
              {/* Filter Tabs */}
              <div className="filter-tabs mb-4">
                <button className="filter-btn active">All</button>
              </div>

              {/* Bookings List */}
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <Film size={64} className="text-muted" />
                  <h3>No bookings yet</h3>
                  <p>Book your first movie ticket!</p>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map(booking => (
                    <div key={booking.booking_id} className="booking-card">
                      {/* <img src={booking.poster} alt={booking.movieName} /> */}
                      <div className="booking-details">
                        <h4>{booking.event_title}</h4>
                        <div className='d-flex gap-1'>
                        <p>{booking.event_location}</p>
                        <p>{booking.event_scheduled_date} | {booking.time}</p>
                        <p>Seats: {booking.seats}</p>
                        </div>
                      </div>
                      <div className="booking-actions">
                            <p className="amount">₹{booking.price}</p>
                            <a href={`/BookedConfrimation/${booking.booking_id}`} className="btn-view">View Details</a>
                        </div>
                     
                    </div>
                  ))}
                </div>
              )}
            </div>
                )}
          </div>
        </div>
      </div>

    </>
  );
}