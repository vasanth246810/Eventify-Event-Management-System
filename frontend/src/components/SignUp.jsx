import { useState } from "react";
import "../components/Styles/Signup.css";
import axios from "axios";
export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) =>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validateUsername = (username) => username.length >= 3;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let message = "";
    if (name === "username" && value && !validateUsername(value)) {
      message = "Username must be at least 3 characters";
    }
    if (name === "email" && value && !validateEmail(value)) {
      message = "Please enter a valid email address";
    }
    if (name === "password" && value && !validatePassword(value)) {
      message = "Password must be at least 8 characters long";
    }

    setErrors({ ...errors, [name]: message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (!validateUsername(formData.username)) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted ✅", formData);

      try {
        // Fetch CSRF token
        const csrfResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`, { withCredentials: 'include' });
        const csrfToken = csrfResponse.data.csrfToken;

        // Submit form with CSRF token
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/SignUp/`,
          formData,
          {
            headers: {
              'X-CSRFToken': csrfToken,
              'Content-Type': 'application/json',
            },
            withCredentials: 'include',
          }
        );
        console.log(response.data);
        alert('Sign up successful!');
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
      <section className="signup-container">
        <div className="form-header">
          <h2 className="form-title">Create Your Account</h2>
        </div>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className={`form-input ${errors.username ? "error" : ""}`}
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="username"
            />
            {errors.username && (
              <div className="form-error">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{position:"relative"}}>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
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

          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>

        <div className="signup-link">
          Already have an account?{" "}
          <a href="/Login">Sign In</a>
        </div>
      </section>
    </main>
  );
}
