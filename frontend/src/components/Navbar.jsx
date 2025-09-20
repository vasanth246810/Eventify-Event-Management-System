
import { NavLink,Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
function Navbar({username}) {
  const navigate = useNavigate();
  const location = useLocation();

return(
<nav className="navbar navbar-expand-lg navbar-custom">
  <div className="nav-container">
    {/* Left */}
    <div className="navbar-brand upcoming-event">Eventifyy</div>

    {/* Center */}
    <div className="navbar-nav center-nav">
      <NavLink className="nav-link custom-link" to="/home">Home</NavLink>
      <NavLink className="nav-link custom-link" to="/about">About Us</NavLink>
      <NavLink className="nav-link custom-link" to="/events">Events</NavLink>
      <NavLink className="nav-link custom-link" to="/contact">Contact Us</NavLink>
    </div>

    {/* Right */}
    <div className="user-dropdown">
      {username ? (
        <div className="dropdown">
          <button
            className="btn btn-outline-dark dropdown-toggle d-flex align-items-center"
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
              <button className="dropdown-item text-danger" onClick={() => navigate('/logout', { state: { from: location } })}>
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="dropdown">
          <button
            className="btn btn-outline-dark dropdown-toggle d-flex align-items-center"
            type="button"
            id="guestDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
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
</nav>

   );
}

export default Navbar;