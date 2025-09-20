import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation,Navigate } from "react-router-dom";
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
import { useEffect, useState } from 'react';

function Layout() {
  const location = useLocation();
  const hideNavbarRoutes = ["/Login", "/SignUp"];
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar username={username} />}
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
      </Routes>
      {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
