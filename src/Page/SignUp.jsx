import React, { useState } from "react";
import "./SignUp.css";

import bgImage from "/assets/signup.jpg";
import bgImage2 from "/assets/login.jpg";

import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";

import { usePass } from "../protection/ProtectedPass";

const API_URL = "http://localhost:3000";

const SignUp = () => {
  const [currentPage, setCurrentPage] = useState("signup");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = usePass();

  const navigate = useNavigate();
  const location = useLocation();

  // -----------------------------
  // Handle input changes
  // -----------------------------
  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  // -----------------------------
  // Switch between Login / Signup
  // -----------------------------
  const switchPage = (page) => {
    setCurrentPage(page);

    setError("");

    setFormData({
      fullName: "",
      email: "",
      password: "",
    });
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Basic frontend validation
      if (currentPage === "signup" && !formData.fullName.trim()) {
        throw new Error("Please enter your full name.");
      }

      if (!formData.email.trim()) {
        throw new Error("Please enter your email.");
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }

      if (!formData.password) {
        throw new Error("Please enter your password.");
      }

      if (formData.password.length < 6) {
        throw new Error(
          "Password must be at least 6 characters long."
        );
      }

      // Login only needs email + password
      const requestData =
        currentPage === "signup"
          ? {
              fullName: formData.fullName.trim(),
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
            }
          : {
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
            };

      const endpoint =
        currentPage === "signup"
          ? `${API_URL}/signup`
          : `${API_URL}/login`;

      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

      // -----------------------------
      // Authentication
      // -----------------------------
      login();

      // -----------------------------
      // Success message
      // -----------------------------
      setError("");

      // -----------------------------
      // Redirect
      // -----------------------------
      const origin =
        location.state?.from?.pathname || "/Home";

      navigate(origin, {
        replace: true,
      });
    } catch (error) {
      console.error("Authentication error:", error);

      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ======================================
          SIGN UP
      ====================================== */}

      {currentPage === "signup" && (
        <div className="full-page-wrapper">

          <div
            className="full-image-section"
            style={{
              backgroundImage: `url(${bgImage})`,
            }}
          >
            <div className="image-overlay">
              <h1>CyberSage</h1>

              <p>
                Protect your system.
                <br />
                Build with confidence.
              </p>
            </div>
          </div>

          <div className="full-form-section">

            <div className="form-container">

              <h2 className="form-title">
                Create An Account
              </h2>

              <p className="form-subtitle">
                Join CyberSage today
              </p>

              <form onSubmit={handleSubmit}>

                {/* Full Name */}

                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pill-input"
                  autoComplete="name"
                />

                {/* Email */}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pill-input"
                  autoComplete="email"
                />

                {/* Password */}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pill-input"
                  autoComplete="new-password"
                />

                {/* Error */}

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* Login link */}

                <p className="switch-text">
                  Already have an account?{" "}

                  <button
                    type="button"
                    className="switch-button"
                    onClick={() => switchPage("login")}
                  >
                    Log In
                  </button>
                </p>

                {/* Submit */}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>

              </form>

              {/* Divider */}

              <div className="divider">

                <div className="divider-line"></div>

                <span className="or-text">
                  or
                </span>

                <div className="divider-line"></div>

              </div>

              {/* Google */}

              <button
                type="button"
                className="google-btn"
                onClick={() =>
                  alert("Google authentication coming soon.")
                }
              >
                <span>Continue with Google</span>

                <FcGoogle className="google-icon" />
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ======================================
          LOGIN
      ====================================== */}

      {currentPage === "login" && (
        <div className="full-page-wrapper">

          <div
            className="full-image-section-two"
            style={{
              backgroundImage: `url(${bgImage2})`,
            }}
          >
            <div className="image-overlay">
              <h1>CyberSage</h1>

              <p>
                Welcome back.
                <br />
                Your system awaits.
              </p>
            </div>
          </div>

          <div className="full-form-section">

            <div className="form-container">

              <h2 className="form-title">
                Welcome Back
              </h2>

              <p className="form-subtitle">
                Log in to your account
              </p>

              <form onSubmit={handleSubmit}>

                {/* Email */}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pill-input"
                  autoComplete="email"
                />

                {/* Password */}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pill-input"
                  autoComplete="current-password"
                />

                {/* Error */}

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                {/* Signup link */}

                <p className="switch-text">
                  Don't have an account?{" "}

                  <button
                    type="button"
                    className="switch-button"
                    onClick={() => switchPage("signup")}
                  >
                    Sign Up
                  </button>
                </p>

                {/* Submit */}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Logging In..." : "Log In"}
                </button>

              </form>

              {/* Divider */}

              <div className="divider">

                <div className="divider-line"></div>

                <span className="or-text">
                  or
                </span>

                <div className="divider-line"></div>

              </div>

              {/* Google */}

              <button
                type="button"
                className="google-btn"
                onClick={() =>
                  alert("Google authentication coming soon.")
                }
              >
                <span>Continue with Google</span>

                <FcGoogle className="google-icon" />
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;