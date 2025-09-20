import  { useState } from "react";
import "./Login.css"; 
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";


export default function LoginPage({ setUsername }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const csrfResponse = await axios.get("http://localhost:8000/api/get-csrf-token/", { withCredentials: true });
        const csrfToken = csrfResponse.data.csrfToken;
        const lastVisited = sessionStorage.getItem("lastVisited") || "/";
        const response = await axios.post(
          "http://localhost:8000/api/Login/",
          { email, password, next: lastVisited },
          {
            headers: {
              'X-CSRFToken': csrfToken,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        const username = response.data.user.username;
        setUsername(username);
        sessionStorage.setItem('emailaddress', email);
        sessionStorage.setItem('username', username);
        const nextParam = searchParams.get('next');
        const redirectTo = nextParam || location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      } catch (error) {
        if (error.response) {
          console.error('Response error:', error.response.data);
          alert('Error: ' + (error.response.data.error || 'Something went wrong'));
        } else if (error.request) {
          console.error('Network error:', error.request);
          alert('Network error: Please check if the backend server is running on localhost:8000');
        } else {
          console.error('Request setup error:', error.message);
          alert('Request error: ' + error.message);
        }
      }
    }
  };

  const togglePassword = () => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
  };

  return (
    <main className="main-container">
      <div className="content-wrapper">
        {/* Left Hero Content */}
        <section className="login-content">
          <div className="hero-badge">
            <span>🚀</span>
            <span>Trusted by 10,000+ Organizations</span>
          </div>
          <h1 className="hero-title">Enterprise Event Management Made Simple</h1>
          <p className="hero-subtitle">
            Streamline your event operations with our comprehensive platform.
            From registration to analytics, manage every aspect of your events
            with enterprise-grade security and reliability.
          </p>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">99.9% Uptime SLA</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">SOC 2 Compliant</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <div className="feature-text">Real-time Analytics</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌐</div>
              <div className="feature-text">Global Scale</div>
            </div>
          </div>
        </section>

        {/* Right Sign-in Form */}
        <section className="signin-container">
          <div className="form-header">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to your EventPro account</p>
          </div>

          <form className="signin-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="Email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {errors.email && (
                <div className="form-error">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  id="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePassword}
                  aria-label="Toggle password visibility"
                >
                  👁
                </button>
              </div>
              {errors.password && (
                <div className="form-error">{errors.password}</div>
              )}
            </div>

            <div className="form-options">
              <a href="#forgot" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="submit-button">
              Sign In
            </button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">Or continue with</span>
            <div className="divider-line"></div>
          </div>

          <div className="social-buttons">
            <button className="social-button" type="button">
               <i className="fab fa-google"></i>Google
            </button>
            <button className="social-button" type="button">
               <i className="fab fa-facebook-f"></i>Facebook
            </button>
          </div>

          <div className="signup-link">
            New to EventPro? <a href="/SignUp">Create an account</a>
          </div>
        </section>
      </div>
    </main>
  );
}
