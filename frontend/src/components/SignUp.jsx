import { useState } from "react";
import "../components/Styles/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be under 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export default function SignUp({ setUsername }) {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    setSuccessMessage("");
    try {
      // Fetch CSRF token
      const csrfResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/get-csrf-token/`,
        { withCredentials: true }
      );
      const csrfToken = csrfResponse.data.csrfToken;

      // Submit form with CSRF token
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/SignUp/`,
        data,
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const user = response.data.user;
        if (setUsername && user.username) {
          setUsername(user.username);
        }
        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("emailaddress", user.email);

        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data;
        if (responseData.errors) {
          // Field-specific validation errors from Django form
          Object.entries(responseData.errors).forEach(([field, errList]) => {
            const message = Array.isArray(errList) ? errList.join(" ") : String(errList);
            setError(field, { message });
          });
        } else {
          setError("root", {
            message: responseData.error || "Signup failed. Please try again.",
          });
        }
      } else if (error.request) {
        setError("root", {
          message: "Network error: Please check if the backend server is running on localhost:8000",
        });
      } else {
        setError("root", {
          message: "Request error: " + error.message,
        });
      }
    }
  };

  return (
    <main className="main-container">
      <section className="signup-container">
        <div className="form-header">
          <h2 className="form-title">Create Your Account</h2>
        </div>

        {errors.root && (
          <div className="alert alert-danger py-2 small mb-3 text-center" style={{ borderRadius: "8px" }}>
            {errors.root.message}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success py-2 small mb-3 text-center" style={{ borderRadius: "8px" }}>
            {successMessage}
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`form-input ${errors.username ? "error" : ""}`}
              placeholder="Enter your username"
              autoComplete="username"
              {...register("username")}
            />
            {errors.username && (
              <div className="form-error">{errors.username.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <div className="form-error">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Create a password (min. 8 characters, letters & numbers)"
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "👁️‍🗨️" : "👁"}
              </button>
            </div>
            {errors.password && (
              <div className="form-error">{errors.password.message}</div>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-link">
          Already have an account? <a href="/Login">Sign In</a>
        </div>
      </section>
    </main>
  );
}
