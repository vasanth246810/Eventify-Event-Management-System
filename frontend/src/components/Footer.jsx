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
            <h2 className="footer-brand-logo">Eventify</h2>
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