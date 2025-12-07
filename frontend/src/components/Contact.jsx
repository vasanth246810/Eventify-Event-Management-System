
import axios from 'axios';
import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import "../components/Styles/Contact.css";
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
                let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/contact/`);
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
    <div className="container" >
        <h1>Get In Touch</h1>
        <p className="contact-subtitle">Ready to create an unforgettable event? We're here to help bring your vision to life. Contact us today for a free consultation.</p>
    </div>
</section>
<section className="section section-alt">
    <div className="container" style={{maxWidth:"1200px"}}>
        <div className="contact-content">
            <div className="contact-form">
                <h2 style={{color: "#ffffff", marginBottom: "2rem", fontSize: "2rem"}}>Send Us a Message</h2>
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


<section style={{background: "#000000", color: "#ffffff", textAlign: "center", padding: "4rem 0",fontSize: "1.1rem"}}>
    <div className="container">
        <h2 style={{fontSize: "2rem", marginBottom: "1rem"}}>Ready to Start Planning?</h2>
        <p style={{fontSize: "1.1rem", color: "#ffffff", marginBottom: "2rem"}}>Let's create something amazing together. Contact us today!</p>
        <a href="tel:+919876543210" style={{background: "#ff2c55", color: "#ffffff", padding: "1rem 2rem", borderRadius: "6px", textDecoration: "none", fontWeight: "600", border: "2px solid #ff2c55", transition: "all 0.3s ease"}}>Call Now: +91 98765 43210</a>
    </div>
</section>

    </div>
    );
}