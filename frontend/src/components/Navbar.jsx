import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import "../components/Styles/Navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Navbar({ username }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile] = useState(sessionStorage.getItem("profile") || "");
  const [isScrolled, setIsScrolled] = useState(false);

  // Smooth scroll listener to morph navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Check initial position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`morph-nav-wrapper ${isScrolled ? "scrolled" : ""}`}>
      <nav className="morph-nav-container" aria-label="Main Navigation">
        {/* Custom Eventify Logo: Festival DJ Mascot + Cyber-Stencil ΣVENTIFY */}
        <Link to="/home" className="morph-brand-group" title="Eventify Home">
          <div className="morph-logo-badge">
            <svg
              className="morph-logo-svg"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head contour */}
              <circle
                cx="16"
                cy="18"
                r="10"
                stroke={isScrolled ? "#07080c" : "#ffffff"}
                strokeWidth="2.2"
              />
              {/* Headphone/hair curve */}
              <path
                d="M 8 16 C 8 8, 24 8, 24 16"
                stroke={isScrolled ? "#07080c" : "#ffffff"}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Hair flick */}
              <path
                d="M 12 7 C 10 3.5, 18 3.5, 20 6"
                stroke={isScrolled ? "#ff2c55" : "#ffffff"}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Eyes */}
              <circle
                cx="13"
                cy="18"
                r="1.3"
                fill={isScrolled ? "#07080c" : "#ffffff"}
              />
              <circle
                cx="19"
                cy="18"
                r="1.3"
                fill={isScrolled ? "#07080c" : "#ffffff"}
              />
            </svg>
          </div>

          <span className="morph-brand-text" aria-label="Eventify">
            <svg
              className="morph-brand-wordmark-svg"
              viewBox="0 0 172 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bold Σ (Signature Red) */}
              <path
                d="M 2 3 H 20 L 11 13 L 20 23 H 2 L 8 13 Z"
                fill="#ff2c55"
              />
              {/* Bold V */}
              <path
                d="M 24 3 L 34 23 H 42 L 32 3 Z"
                fill="#ffffff"
              />
              {/* Bold ≡ (Triple Horizontal Bars) */}
              <rect x="46" y="3" width="18" height="5" rx="1" fill="#ffffff" />
              <rect x="46" y="10.5" width="18" height="5" rx="1" fill="#ffffff" />
              <rect x="46" y="18" width="18" height="5" rx="1" fill="#ffffff" />
              {/* Bold N */}
              <path
                d="M 68 23 V 3 H 74 L 84 17 V 3 H 89 V 23 H 83 L 73 9 V 23 Z"
                fill="#ffffff"
              />
              {/* Bold T */}
              <path
                d="M 93 3 H 111 V 8 H 105 V 23 H 99 V 8 H 93 Z"
                fill="#ffffff"
              />
              {/* Bold I */}
              <rect x="115" y="3" width="6" height="20" rx="1" fill="#ffffff" />
              {/* Bold F */}
              <path
                d="M 125 3 H 141 V 8 H 131 V 11 H 139 V 16 H 131 V 23 H 125 Z"
                fill="#ffffff"
              />
              {/* Bold Y */}
              <path
                d="M 145 3 L 153 13 V 23 H 159 V 13 L 167 3 H 160 L 156 9 L 152 3 Z"
                fill="#ffffff"
              />
            </svg>
          </span>
        </Link>

        {/* Center Navigation Links */}
        <ul className="morph-nav-links">
          <li>
            <NavLink className="morph-nav-link" to="/home">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                isActive || location.pathname.startsWith("/event-list/")
                  ? "morph-nav-link active"
                  : "morph-nav-link"
              }
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                isActive || location.pathname.startsWith("/movies")
                  ? "morph-nav-link active"
                  : "morph-nav-link"
              }
            >
              Movies
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/events/a-r-rahman-wonderment-tour-live-in-concert-delhi-2026/buy-page/shows/6a9daea2f46f18fdd7f7edf6"
              className={({ isActive }) =>
                isActive || location.pathname.includes("/buy-page")
                  ? "morph-nav-link active"
                  : "morph-nav-link"
              }
            >
              A.R. Rahman Live
            </NavLink>
          </li> */}
          <li>
            <NavLink className="morph-nav-link" to="/about">
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink className="morph-nav-link" to="/contact">
              Contact Us
            </NavLink>
          </li>
        </ul>

        {/* Right Section Actions */}
        <div className="morph-nav-actions">
          {username ? (
            <div className="dropdown">
              <button
                className={`morph-user-btn dropdown-toggle ${
                  isScrolled ? "morph-capsule-pill" : ""
                }`}
                type="button"
                id="morphUserDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {profile ? (
                  <img src={profile} className="morph-avatar-img" alt="avatar" />
                ) : (
                  <i className="fas fa-user-circle text-danger fs-6"></i>
                )}
                <span>{username}</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end morph-dropdown-menu"
                aria-labelledby="morphUserDropdown"
              >
                <li>
                  <button
                    className="morph-dropdown-item"
                    onClick={() => navigate("/profile", { state: { from: location } })}
                  >
                    <i className="fas fa-user-circle me-2 text-danger"></i> Profile
                  </button>
                </li>
                <li>
                  <button
                    className="morph-dropdown-item text-danger"
                    onClick={() => navigate("/logout", { state: { from: location } })}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              {/* Normal Top State Buttons */}
              <Link to="/Login" className="morph-btn-signin">
                Sign In
              </Link>
              <Link to="/SignUp" className="morph-btn-signup">
                Sign Up
              </Link>

              {/* Scrolled State: Solid White Pill Button */}
              <Link to="/Login" className="morph-capsule-pill">
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
