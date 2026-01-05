import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useSearchParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Event from "./components/Event";
import Contact from "./components/Contact";
import EventList from "./components/EventList";
import BookingTickets from "./components/BookingTickets";
import BookingConfirmation from "./components/BookingConfirmation";
import LoginPage from './components/Login';
import SignUp from './components/SignUp';
import Logout from './components/Logout';
import PopupGfg from './components/Popup';
import ArtistInfo from './components/Artistinfo'
import AccountProfile from './components/Profile'
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import Users from './admin/pages/Users';
import Events from './admin/pages/Events';
import Bookings from './admin/pages/Booking';
import { useEffect, useState } from 'react';
import AdminRoute from "./routes/AdminRoute";


function Layout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const hideNavbarRoutes = [
    "/login",
    "/Login",
    "/signup",
    "/SignUp",
    "/admin",
    "/admin/dashboard",
    "/admin/users",
    "/admin/events",
    "/admin/bookings",
  ];
  const qrscan = searchParams.get('qrscan') === 'true';
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname) || (location.pathname.startsWith('/BookedConfrimation/') && qrscan);
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <>
      {!shouldHideNavbar && <Navbar username={username} />}
      <div className="main-content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Event />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/event-list/:id" element={<EventList />} />
          <Route path="/BookingTickets/:id" element={<BookingTickets />} />
          <Route path="/BookedConfrimation/:id" element={<BookingConfirmation />} />
          <Route path="/Login" element={<LoginPage setUsername={setUsername} />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/logout" element={<Logout setUsername={setUsername} />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
          <Route path="/popup" element={<PopupGfg />} />
          <Route path="/artists/:name" element={<ArtistInfo />}/>
          <Route path="/profile" element={<AccountProfile />}/>
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="events" element={<Events />} />
            <Route path="bookings" element={<Bookings />} />
          </Route>        
        </Routes>
      </div>
      {!shouldHideNavbar && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
          <Layout />
      </Router>
    </div>
  );
}

export default App;
