
import axios from 'axios';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import "./Contact.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Contact(){
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        const fetchdata = async () => {
            try {
                let response = await axios.get("http://localhost:8000/api/contact/");
                setData(response.data);
            } catch (error) {
                console.error('Error fetching contact data:', error);
                setData({page: 'Error', content: 'Failed to load data'});
            }
        };
        fetchdata();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const serviceId = 'service_hjl3bd9';
            const templateId = 'template_9dg1ix9';
            const publicKey = 'eFJytcy4HeMVp-6I0';

            const templateParams = {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                email: 'vasanths2468@gmail.com'
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            setSubmitMessage('Message sent successfully!');
            setTimeout(() => {
                setSubmitMessage('');
            }, 3000);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error sending email:', error);
            setSubmitMessage('Failed to send message. Please try again.');
             setTimeout(() => {
                setSubmitMessage('');
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };
    return(
      <div>
      <section className="contact-hero">
    <div className="container">
        <h1>Get In Touch</h1>
        <p className="contact-subtitle">Ready to create an unforgettable event? We're here to help bring your vision to life. Contact us today for a free consultation.</p>
    </div>
</section>

<section className="contact-section">
    <div className="container">
        <div className="contact-grid">
            <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Call Us</h3>
                <p>Speak directly with our event planning experts for immediate assistance</p>
                <div className="contact-info">+91 98765 43210</div>
            </div>

            <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <h3>Email Us</h3>
                <p>Send us your event details and we'll respond within 24 hours</p>
                <div className="contact-info">hello@eventifyy.com</div>
            </div>

            <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Get instant answers to your questions through our live chat support</p>
                <div className="contact-info">Available 9 AM - 8 PM</div>
            </div>

            <div className="contact-card">
                <div className="contact-icon">📅</div>
                <h3>Book Consultation</h3>
                <p>Schedule a free 30-minute consultation with our planning experts</p>
                <div className="contact-info">Free Consultation</div>
            </div>
        </div>
    </div>
</section>

<section className="section section-alt">
    <div className="container">
        <div className="main-content">
            <div className="contact-form">
                <h2 style={{color: "#000000", marginBottom: "2rem", fontSize: "2rem"}}>Send Us a Message</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-msg" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
                {submitMessage && <p className="submit-message">{submitMessage}</p>}
            </div>

        </div>
    </div>
</section>


<section style={{background: "#ffffff", color: "#000000", textAlign: "center", padding: "4rem 0",fontSize: "1.1rem"}}>
    <div className="container">
        <h2 style={{fontSize: "2rem", marginBottom: "1rem"}}>Ready to Start Planning?</h2>
        <p style={{fontSize: "1.1rem", color: "#000000", marginBottom: "2rem"}}>Let's create something amazing together. Contact us today!</p>
        <a href="tel:+919876543210" style={{background: "#ffffff", color: "#000000", padding: "1rem 2rem", borderRadius: "6px", textDecoration: "none", fontWeight: "600", border: "2px solid #ffffff", transition: "all 0.3s ease"}}>Call Now: +91 98765 43210</a>
    </div>
</section>

    </div>
    );
}