import { useState, useEffect } from "react";
import "../components/Styles/Login.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage({ setUsername }) {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi-script')) {
        initializeGoogleSignIn();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google script loaded successfully');
        initializeGoogleSignIn();
      };
      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
      };
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "846473017587-v529o432kqu83ogi73ela45b85ej3i1n.apps.googleusercontent.com",
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          
          const buttonDiv = document.getElementById("googleSignInDiv");
          if (buttonDiv) {
            window.google.accounts.id.renderButton(
              buttonDiv,
              { 
                theme: "outline", 
                size: "large",
                width: 250,
                text: "continue_with",
                shape: "rectangular"
              }
            );
          }
          
          setGoogleLoaded(true);
          console.log("Google Sign-In initialized successfully");
        } catch (error) {
          console.error("Error initializing Google Sign-In:", error);
        }
      } else {
        console.warn("Google Sign-In not available yet");
      }
    };

    loadGoogleScript();

    return () => {
      const script = document.getElementById('google-gsi-script');
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleGoogleCallback = async (response) => {
    const id_token = response.credential;
    try {
      const csrfResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`, 
        { withCredentials: true }
      );
      const csrfToken = csrfResponse.data.csrfToken;
      const lastVisited = sessionStorage.getItem("lastVisited") || "/";
      
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/google_login/`,
        { id_token, next: lastVisited },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      
      if (res.data.success) {
        const username = res.data.user.username;
        setUsername(username);
        sessionStorage.setItem('emailaddress', res.data.user.email);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('profile', res.data.user.profile);

        const nextParam = searchParams.get('next');
        const redirectTo = nextParam || location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      } else {
        alert('Login failed: ' + (res.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.response) {
        alert('Error: ' + (error.response.data.error || 'Something went wrong'));
      } else {
        alert('Network error: Please check if the backend server is running on localhost:8000');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const csrfResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`, 
        { withCredentials: true }
      );
      const csrfToken = csrfResponse.data.csrfToken;
      const lastVisited = sessionStorage.getItem("lastVisited") || "/";
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/Login/`,
        { email: data.email, password: data.password, next: lastVisited },
        {
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      
      if (response.data.success) {
        const username = response.data.user.username;
        setUsername(username);
        sessionStorage.setItem('emailaddress', data.email);
        sessionStorage.setItem('username', username);
        
        const nextParam = searchParams.get('next');
        const redirectTo = nextParam || location.state?.from?.pathname || "/";
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        setFormError("root", { message: error.response.data.error || 'Invalid email or password' });
      } else if (error.request) {
        setFormError("root", { message: 'Network error: Please check if backend is running on localhost:8000' });
      } else {
        setFormError("root", { message: error.message });
      }
    }
  };

  const togglePassword = () => {
    const input = document.getElementById("password");
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
    }
  };

  return (
    <main className="main-container">
      <div className="content-wrapper">
        <section className="signin-container">
          <div className="form-header">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">Sign in to your Eventify account</p>
          </div>

          <form className="signin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {errors.root && (
              <div className="alert alert-danger py-2 small mb-3 text-center" style={{ borderRadius: '8px' }}>
                {errors.root.message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Enter your Email"
                {...register("email")}
                autoComplete="email"
              />
              {errors.email && (
                <div className="form-error">{errors.email.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div style={{ position: "relative"}}>
                <input
                  type="password"
                  id="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Enter your password"
                  {...register("password")}
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
                <div className="form-error">{errors.password.message}</div>
              )}
            </div>

            <div className="form-options">
              <a href="#forgot" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">Or continue with</span>
            <div className="divider-line"></div>
          </div>

          <div className="social-buttons justify-content-center align-items-center">
            {/* Google will render its button here */}
            <div id="googleSignInDiv" className="d-flex justify-content-center align-items-center"></div>
            
            {/* Fallback message */}
            {!googleLoaded && (
              <div style={{ textAlign: 'center', color: 'white' }}>
                Loading Google Sign-In...
              </div>
            )}
          </div>

          <div className="login-link">
            New to Eventify? <a href="/SignUp">Create an account</a>
          </div>
        </section>
      </div>
    </main>
  );
}