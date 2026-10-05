import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import "../components/Styles/Footer.css";

const Footer = () => {
  const footerLinks = {
    explore: [
      { label: 'Browse Events', href: '/events' },
      { label: 'Artists', href: '/artists' },
      { label: 'My Bookings', href: '/profile' }
    ],
    company: [
      { label: 'Home', href: '/home' },
      { label: 'About Us', href: '/about' },
      { label: 'Events', href: 'events' },
      { label: 'Contact', href: '/contact' }
    ],
    account: [
      { label: 'Login', href: '/login' },
      { label: 'Sign Up', href: '/signup' },
      { label: 'Profile', href: '/profile' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="footer-eventify">
      <div className="container py-5">
        <div className="row g-4 mb-4">
          
          {/* Brand Column */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#16171b",
                  border: "1px solid #222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  width="26"
                  height="26"
                >
                  <circle cx="16" cy="18" r="10" stroke="#ff2c55" strokeWidth="2.2" />
                  <path d="M 8 16 C 8 8, 24 8, 24 16" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M 12 7 C 10 3.5, 18 3.5, 20 6" stroke="#ff2c55" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="13" cy="18" r="1.3" fill="#ffffff" />
                  <circle cx="19" cy="18" r="1.3" fill="#ffffff" />
                </svg>
              </div>
              <svg
                viewBox="0 0 172 26"
                fill="none"
                height="22"
                style={{ width: "auto", display: "block" }}
              >
                <path d="M 2 3 H 20 L 11 13 L 20 23 H 2 L 8 13 Z" fill="#ff2c55" />
                <path d="M 24 3 L 34 23 H 42 L 32 3 Z" fill="#ffffff" />
                <rect x="46" y="3" width="18" height="5" rx="1" fill="#ffffff" />
                <rect x="46" y="10.5" width="18" height="5" rx="1" fill="#ffffff" />
                <rect x="46" y="18" width="18" height="5" rx="1" fill="#ffffff" />
                <path d="M 68 23 V 3 H 74 L 84 17 V 3 H 89 V 23 H 83 L 73 9 V 23 Z" fill="#ffffff" />
                <path d="M 93 3 H 111 V 8 H 105 V 23 H 99 V 8 H 93 Z" fill="#ffffff" />
                <rect x="115" y="3" width="6" height="20" rx="1" fill="#ffffff" />
                <path d="M 125 3 H 141 V 8 H 131 V 11 H 139 V 16 H 131 V 23 H 125 Z" fill="#ffffff" />
                <path d="M 145 3 L 153 13 V 23 H 159 V 13 L 167 3 H 160 L 156 9 L 152 3 Z" fill="#ffffff" />
              </svg>
            </div>
            <p className="footer-description">
              Discover and book amazing events. Experience unforgettable moments with Eventify.
            </p>
            
            {/* Social Links */}
            <div className="d-flex">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="social-link"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Explore Column */}
          <div className="col-6 col-md-6 col-lg-2">
            <h3 className="footer-column-title">Explore</h3>
            <ul className="list-unstyled">
              {footerLinks.explore.map((link) => (
                <li key={link.label} className="mb-2">
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-6 col-md-6 col-lg-3">
            <h3 className="footer-column-title">Company</h3>
            <ul className="list-unstyled">
              {footerLinks.company.map((link) => (
                <li key={link.label} className="mb-2">
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Column */}
          <div className="col-6 col-md-6 col-lg-3">
            <h3 className="footer-column-title">Account</h3>
            <ul className="list-unstyled">
              {footerLinks.account.map((link) => (
                <li key={link.label} className="mb-2">
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <p className="footer-copyright mb-0">
                © 2025 <span className="copyright-highlight">Eventify</span>. All rights reserved.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <ul className="list-inline mb-0 text-md-end">
                <li className="list-inline-item me-3">
                  <a href="/privacy" className="footer-bottom-link">
                    Privacy Policy
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="/terms" className="footer-bottom-link">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;