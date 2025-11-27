
import '../components/Styles/Home.css'
// ./src/components/Home.jsx 4:0-27

export default function Home(){
    return(
 <div>
<section class="home-hero">
    <div class="container">
        <div class="home-hero-content">
            <h1 style={{color: '#ff2c55'}}>Create Unforgettable<br></br>Event Experiences</h1>
            <p class="home-subtitles">Transform your vision into reality with professional event management solutions. From corporate conferences to dream weddings, we make every moment perfect.</p>
            <div class="home-hero-buttons">
                 <a href="{% url 'contact' %}" class="homebutton">Start Planning Now</a>
                <a href="{% url 'AboutUs' %}" class="home-AboutButton">Learn More</a>
            </div>

            <div class="home-stats">
                <div class="home-stat">
                    <span class="home-number">5,000+</span>
                    <div class="home-label">Events Successfully Managed</div>
                </div>
                <div class="home-stat">
                    <span class="home-number">50K+</span>
                    <div class="home-label">Happy Attendees</div>
                </div>
                <div class="home-stat">
                    <span class="home-number">500+</span>
                    <div class="home-label">Satisfied Clients</div>
                </div>
                <div class="home-stat">
                    <span class="home-number">99.9%</span>
                    <div class="home-label">Success Rate</div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="home-section">
    <div class="container">
        <div class="home-section-header">
            <h2 class="home-section-title" style={{color: '#ff2c55'}}>Our Expert Services</h2>
            <p class="home-section-subtitle">Comprehensive event management solutions tailored to your unique needs and vision.</p>
        </div>

        <div class="home-services-grid">
            <div class="home-service-card">
                <div class="home-service-icon">🎯</div>
                <h3>Corporate Events</h3>
                <p>Professional conferences, seminars, product launches, and corporate celebrations that enhance your brand image.</p>
            </div>
            <div class="home-service-card">
                <div class="home-service-icon">💍</div>
                <h3>Weddings & Social</h3>
                <p>Magical wedding ceremonies, receptions, and social gatherings that create memories to last a lifetime.</p>
            </div>
            <div class="home-service-card">
                <div class="home-service-icon">🎪</div>
                <h3>Entertainment Events</h3>
                <p>Concerts, festivals, award shows, and entertainment events that captivate and engage your audience.</p>
            </div>
            <div class="home-service-card">
                <div class="home-service-icon">🏢</div>
                <h3>Venue Management</h3>
                <p>Complete venue sourcing, booking, and coordination to find the perfect space for your event.</p>
            </div>
        </div>
    </div>
</section>

<section class="home-section home-section-alt">
    <div class="container">
        <div class="home-section-header">
            <h2 class="home-section-title" style={{color: '#ff2c55'}}>How It Works</h2>
            <p class="home-section-subtitle">Our streamlined process ensures your event is flawlessly executed from start to finish.</p>
        </div>

        <div class="home-process-grid">
            <div class="home-process-step">
                <div class="home-step-number">1</div>
                <h4>Plan & Consult</h4>
                <p>We discuss your vision, requirements, and budget to create a customized event plan that exceeds expectations.</p>
            </div>
            <div class="home-process-step">
                <div class="home-step-number">2</div>
                <h4>Book & Coordinate</h4>
                <p>We handle all bookings, vendor coordination, and logistics to ensure every detail is perfectly arranged.</p>
            </div>
            <div class="home-process-step">
                <div class="home-step-number">3</div>
                <h4>Execute Flawlessly</h4>
                <p>Our team manages every aspect of your event on the day, ensuring seamless execution and memorable experiences.</p>
            </div>
            <div class="home-process-step">
                <div class="home-step-number">4</div>
                <h4>Celebrate Success</h4>
                <p>Enjoy your successful event while we handle post-event activities and provide detailed analytics and feedback.</p>
            </div>
        </div>
    </div>
</section>

<section class="home-section">
    <div class="container">
        <div class="home-section-header">
            <h2 class="home-section-title" style={{color: '#ff2c55'}}>What Our Clients Say</h2>
            <p class="home-section-subtitle">Hear from satisfied clients who trusted us with their most important events.</p>
        </div>

        <div class="home-testimonials-grid">
            <div class="home-testimonial">
                <p class="home-testimonial-text">Eventifyy made our corporate conference absolutely flawless. Their attention to detail and professional approach exceeded all our expectations. Highly recommended!</p>
                <div class="home-testimonial-author">
                    <div class="home-author-avatar">SM</div>
                    <div class="home-author-info">
                        <h5 className='text-light'>Sarah Mitchell</h5>
                        <p>CEO, TechCorp Solutions</p>
                    </div>
                </div>
            </div>
            <div class="home-testimonial">
                <p class="home-testimonial-text">Our wedding was absolutely perfect thanks to the Eventifyy team. They handled every detail beautifully and made our dream day come true.</p>
                <div class="home-testimonial-author">
                    <div class="home-author-avatar">JR</div>
                    <div class="home-author-info">
                        <h5>Jennifer & Robert</h5>
                        <p>Happy Couple</p>
                    </div>
                </div>
            </div>
            <div class="home-testimonial">
                <p class="home-testimonial-text">Professional, reliable, and creative. Eventifyy delivered an outstanding product launch event that generated significant buzz for our brand.</p>
                <div class="home-testimonial-author">
                    <div class="home-author-avatar">MJ</div>
                    <div class="home-author-info">
                        <h5>Michael Johnson</h5>
                        <p>Marketing Director, InnovateCo</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="homecta">
    <div class="container">
        <h2 style={{color: '#ff2c55'}}>Ready to Create Your Perfect Event?</h2>
        <p>Let's bring your vision to life with our expert event management services. Contact us today for a free consultation.</p>
        <a href="{% url 'contact' %}" class="btn-primary">Get Started Today</a> 
    </div>
</section>
    </div>
    );
}