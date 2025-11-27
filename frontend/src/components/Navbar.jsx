
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import '../components/Styles/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Navbar({ username }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        {/* Brand */}
<Link className="navbar-brand" to="/home">Eventifyy</Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Center nav links */}
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/home">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/about">About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                  to="/events"
                  className={({ isActive }) =>
                    isActive || location.pathname.startsWith("/event-list/")
                      ? "nav-link custom-link active"
                      : "nav-link custom-link"
                  }
                >
                  Events
                </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-link" to="/contact">Contact Us</NavLink>
            </li>
          </ul>

          {/* Right dropdown */}
          <div className="d-flex">
            {username ? (
              <div className="dropdown">
                <button
                  className="userbtn btn btn-outline-dark dropdown-toggle d-flex align-items-center rounded-4"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle me-2"></i>
                  <span>{username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <button className=" dropdown-item text-danger" onClick={() => navigate('/logout', { state: { from: location } })}>
                      <i className="fas fa-sign-out-alt me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className=" userbtn btn btn-outline-dark dropdown-toggle d-flex align-items-center rounded-4"
                  type="button"
                  id="guestDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{color:"white"}}
                >
                  <i className="fas fa-user-circle me-2"></i>
                  <span>Guest</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="guestDropdown">
                  <li>
                    <Link className="dropdown-item" to="/signup">
                      <i className="fas fa-user-plus me-2"></i> Sign Up
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate("/Login", { state: { from: location } })}>
                      <i className="fas fa-sign-in-alt me-2"></i> Sign In
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
