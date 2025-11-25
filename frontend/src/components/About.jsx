import axios from 'axios';
import { useState,useEffect } from 'react';
import './About.css'; // Assuming you have a CSS file for styling


export default function About(){
    // const[data,setData]=useState([]);

    // useEffect(()=>{
    //     const fetchdata=async()=>{
    //         try {
    //             let response=await axios.get("http://localhost:8000/api/about/");
    //             setData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching about data:', error);
    //             setData({page: 'Error', content: 'Failed to load data'});
    //         }
    //     };
    //     fetchdata();
    // }, [])
    return(
 <div>
 <section id="about" class="about-hero">
    <div class="container">
        <h1>Crafting Exceptional<br></br>Event Experiences</h1>
        <p class="about-subtitle">We transform your vision into reality with innovative event management solutions that deliver seamless, memorable experiences for every occasion.</p>
    </div>
</section>

<section class="about-section">
    <div class="container">
        <div class="about-two-column ">
            <div class="about-content ">
                {/* <img src={eventImage} alt="" /> */}
                <h3>Our Story</h3>
                <p>Founded with a simple belief: every event should be extraordinary. What started as a small team of passionate event professionals has grown into a leading event management platform trusted by organizations worldwide.</p>
                <p>We combine cutting-edge technology with human creativity to deliver comprehensive solutions that handle every aspect of event planning, from initial concept to post-event analysis.</p>
            </div>
            <div class="about-content">
                <h3>Our Mission</h3>
                <p>To empower event organizers with innovative tools and exceptional service that transform ordinary gatherings into extraordinary experiences.</p>
                <p>We're committed to simplifying event management while maximizing attendee engagement, ensuring every event creates lasting value for all stakeholders.</p>
            </div>
        </div>
    </div>
</section>
 <section class="about-section about-section-alt">
    <div class="container">
        <div class="about-section-header">
            <h2 class="about-section-title">What We Do</h2>
            <p class="about-section-subtitle">Comprehensive event management services designed to handle every detail of your event.</p>
        </div>

        <div class="about-feature-grid">
            <div class="about-feature-card">
                <div class="about-feature-icon">📅</div>
                <h4>Event Planning</h4>
                <p>End-to-end planning services from concept development to execution, ensuring every detail is perfectly orchestrated.</p>
            </div>
            <div class="about-feature-card">
                <div class="about-feature-icon">🎫</div>
                <h4>Registration & Ticketing</h4>
                <p>Advanced registration systems with customizable forms, payment processing, and real-time attendee management.</p>
            </div>
            <div class="about-feature-card">
                <div class="about-feature-icon">🏢</div>
                <h4>Venue Management</h4>
                <p>Comprehensive venue sourcing, booking, and coordination services to find the perfect space for your event.</p>
            </div>
            <div class="about-feature-card">
                <div class="about-feature-icon">📱</div>
                <h4>Event Technology</h4>
                <p>Mobile apps, live streaming, interactive features, and digital engagement tools for modern events.</p>
            </div>
            <div class="about-feature-card">
                <div class="about-feature-icon">🤝</div>
                <h4>Vendor Coordination</h4>
                <p>Seamless management of all vendor relationships, from catering to entertainment, ensuring quality service.</p>
            </div>
            <div class="about-feature-card">
                <div class="about-feature-icon">📊</div>
                <h4>Analytics & Reporting</h4>
                <p>Detailed insights and analytics to measure event success and optimize future event strategies.</p>
            </div>
        </div>
    </div>
</section>

<section class="about-section">
    <div class="container">
        <div class="about-section-header">
            <h2 class="about-section-title">Our Values</h2>
            <p class="about-section-subtitle">The principles that guide everything we do.</p>
        </div>
        <div class="values-grid">
            <div class="value-item">
                <div class="value-icon">🎯</div>
                <h4>Excellence</h4>
                <p>We pursue perfection in every detail, ensuring exceptional results that exceed expectations.</p>
            </div>
            <div class="value-item">
                <div class="value-icon">🚀</div>
                <h4>Innovation</h4>
                <p>We embrace new technologies and creative solutions to stay ahead of industry trends.</p>
            </div>
            <div class="value-item">
                <div class="value-icon">🤝</div>
                <h4>Partnership</h4>
                <p>We build lasting relationships with clients, treating every project as a collaborative effort.</p>
            </div>
            <div class="value-item">
                <div class="value-icon">⚡</div>
                <h4>Reliability</h4>
                <p>Events happen once and must be perfect. We deliver consistent, dependable results every time.</p>
            </div>
        </div>
    </div>
</section>

    </div>
    );
}
