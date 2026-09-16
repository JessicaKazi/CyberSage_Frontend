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

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const switchPage = (page) => {
    setCurrentPage(page);

    setError("");

    setFormData({
      fullName: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
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
        throw new Error("Password must be at least 6 characters long.");
      }

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
        currentPage === "signup" ? `${API_URL}/signup` : `${API_URL}/login`;

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (currentPage === "login" && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      login();

      setError("");

      const origin = location.state?.from?.pathname || "/Home";

      navigate(origin, {
        replace: true,
      });
    } catch (error) {
      console.error("Authentication error:", error);

      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupPage">
      <div className="signupGrid"></div>

      <div className="signupGlow"></div>

      {currentPage === "signup" && (
        <>
          <section className="signupVisual">
            <div className="visualCode visualCodeTop">
              CYBERSAGE // SYSTEM ACCESS
            </div>

            <div className="visualCode visualCodeBottom">
              SIGNUP_01 // NEW USER
            </div>

            <div className="visualOrb"></div>

            <div className="imageCard">
              <span className="corner cornerTL"></span>
              <span className="corner cornerTR"></span>
              <span className="corner cornerBL"></span>
              <span className="corner cornerBR"></span>

              <img src={bgImage} alt="CyberSage system access" />

              <div className="imageOverlay"></div>

              <div className="imageLabel">
                <span>CYBERSAGE</span>
                <small>SYSTEM ACCESS</small>
              </div>
            </div>

            <div className="statusCard statusCardOne">
              <span className="statusDot"></span>

              <div>
                <strong>SYSTEM</strong>
                <small>ONLINE</small>
              </div>
            </div>

            <div className="statusCard statusCardTwo">
              <span className="statusIcon">01</span>

              <div>
                <strong>SECURE</strong>
                <small>REGISTRATION</small>
              </div>
            </div>
          </section>

          <section className="signupFormArea">
            <div className="signupFormBox">
              <div className="formHeader">
                <span className="formTag">[ NEW USER ]</span>

                <h1>
                  CREATE
                  <span> ACCESS.</span>
                </h1>

                <p>
                  Build your CyberSage account and start
                  <br />
                  protecting what matters.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="inputGroup">
                  <label htmlFor="fullName">FULL NAME</label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div className="inputGroup">
                  <label htmlFor="signupEmail">EMAIL ADDRESS</label>

                  <input
                    id="signupEmail"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                <div className="inputGroup">
                  <label htmlFor="signupPassword">PASSWORD</label>

                  <input
                    id="signupPassword"
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>

                {error && <div className="signupError">{error}</div>}

                <button
                  type="submit"
                  className="signupButton"
                  disabled={loading}
                >
                  <span>{loading ? "CREATING..." : "CREATE ACCOUNT"}</span>

                  <span className="buttonArrow">→</span>
                </button>
              </form>

              <div className="loginPrompt">
                <span>ALREADY HAVE ACCESS?</span>

                <button
                  type="button"
                  className="switch-button"
                  onClick={() => switchPage("login")}
                >
                  SIGN IN
                </button>
              </div>

              <div className="divider">
                <div className="divider-line"></div>

                <span className="or-text">OR</span>

                <div className="divider-line"></div>
              </div>

              <button
                type="button"
                className="google-btn"
                onClick={() => alert("Google authentication coming soon.")}
              >
                <span>CONTINUE WITH GOOGLE</span>

                <FcGoogle className="google-icon" />
              </button>

              <div className="formFooter">
                <span>CYBERSAGE_SECURITY</span>
                <span>v2.0.26</span>
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === "login" && (
        <>
          <section className="signupVisual">
            <div className="visualCode visualCodeTop">
              CYBERSAGE // SYSTEM ACCESS
            </div>

            <div className="visualCode visualCodeBottom">
              LOGIN_01 // RETURNING USER
            </div>

            <div className="visualOrb"></div>

            <div className="imageCard">
              <span className="corner cornerTL"></span>
              <span className="corner cornerTR"></span>
              <span className="corner cornerBL"></span>
              <span className="corner cornerBR"></span>

              <img src={bgImage2} alt="CyberSage login" />

              <div className="imageOverlay"></div>

              <div className="imageLabel">
                <span>CYBERSAGE</span>
                <small>SECURE LOGIN</small>
              </div>
            </div>

            <div className="statusCard statusCardOne">
              <span className="statusDot"></span>

              <div>
                <strong>SYSTEM</strong>
                <small>READY</small>
              </div>
            </div>

            <div className="statusCard statusCardTwo">
              <span className="statusIcon">02</span>

              <div>
                <strong>ENCRYPTED</strong>
                <small>CONNECTION</small>
              </div>
            </div>
          </section>

          <section className="signupFormArea">
            <div className="signupFormBox">
              <div className="formHeader">
                <span className="formTag">[ RETURNING USER ]</span>

                <h1>
                  SYSTEM
                  <span> ACCESS.</span>
                </h1>

                <p>
                  Welcome back to CyberSage.
                  <br />
                  Continue where you left off.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="inputGroup">
                  <label htmlFor="loginEmail">EMAIL ADDRESS</label>

                  <input
                    id="loginEmail"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>

                <div className="inputGroup">
                  <label htmlFor="loginPassword">PASSWORD</label>

                  <input
                    id="loginPassword"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>

                {error && <div className="signupError">{error}</div>}

                <button
                  type="submit"
                  className="signupButton"
                  disabled={loading}
                >
                  <span>{loading ? "AUTHENTICATING..." : "ENTER SYSTEM"}</span>

                  <span className="buttonArrow">→</span>
                </button>
              </form>

              <div className="loginPrompt">
                <span>NEW TO CYBERSAGE?</span>

                <button
                  type="button"
                  className="switch-button"
                  onClick={() => switchPage("signup")}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              <div className="divider">
                <div className="divider-line"></div>

                <span className="or-text">OR</span>

                <div className="divider-line"></div>
              </div>

              <button
                type="button"
                className="google-btn"
                onClick={() => alert("Google authentication coming soon.")}
              >
                <span>CONTINUE WITH GOOGLE</span>

                <FcGoogle className="google-icon" />
              </button>

              <div className="formFooter">
                <span>CYBERSAGE_SECURITY</span>
                <span>v2.0.26</span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SignUp;
