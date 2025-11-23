import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-4 text-white" id="contact">
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <h5>Eventifyy</h5>
                    <p>Your premier destination for discovering and booking amazing events. Experience unforgettable moments with us.</p>
                </div>
                <div className="col-md-2">
                    <h6>Quick Links</h6>
                    <ul className="list-unstyled">
                        <li><Link to="/home" className="text-light text-decoration-none">Home</Link></li>
                        <li><Link to="/events" className="text-light text-decoration-none">Events</Link></li>
                        <li><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
                        <li><Link to="/contact" className="text-light text-decoration-none">Contact</Link></li>
                    </ul>
                </div>
                <div className="col-md-3">
                    <h6>Contact Info</h6>
                    <ul className="list-unstyled">
                        <li><i className="bi bi-envelope"></i> support@eventifyy.com</li>
                        <li><i className="bi bi-telephone"></i> +91 98765 43210</li>
                        <li><i className="bi bi-geo-alt"></i> 123 Event Street, Mumbai, India</li>
                    </ul>
                </div>
                <div className="col-md-3">
                    <h6>Follow Us</h6>
                    <div className="social-links">
                        <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
                        <a href="#" className="text-light me-3"><i className="bi bi-instagram"></i></a>
                        <a href="#" className="text-light"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <hr className="my-3" />
            <div className="row">
                <div className="col-md-6">
                    <p className="mb-0">&copy; 2024 Eventifyy. All rights reserved.</p>
                </div>
                <div className="col-md-6 text-md-end">
                    <a href="#" className="text-light text-decoration-none me-3">Privacy Policy</a>
                    <a href="#" className="text-light text-decoration-none">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
      );
};

export default Footer;
