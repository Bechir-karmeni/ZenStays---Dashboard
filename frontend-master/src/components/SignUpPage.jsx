import React, { useState } from "react";
import { Heart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE = "http://localhost:8000";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err?.detail ||
            Object.values(err || {})
              .flat()
              .join(" ") ||
            "Signup failed",
        );
      }

      const loginRes = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!loginRes.ok) {
        const err = await loginRes.json().catch(() => ({}));
        throw new Error(err?.detail || "Login failed right after signup");
      }

      const tokens = await loginRes.json();
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);

      try {
        const meRes = await fetch(`${API_BASE}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${tokens.access}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          localStorage.setItem("me", JSON.stringify(me));
        }
      } catch (_) {
        // ignore profile fetch errors
      }

      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Heart className="auth-heart-icon" />
          </div>
          <h2 className="auth-title">Join DeepMind</h2>
          <p className="auth-subtitle">Create your account to start your wellness journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          <div className="name-row">
            <div className="form-group half-width">
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  id="firstName"
                  autoComplete="off"
                />
                <label
                  className={`floating-label${formData.firstName ? " filled" : ""}`}
                  htmlFor="firstName"
                >
                  First name
                </label>
              </div>
            </div>

            <div className="form-group half-width">
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  id="Lastname"
                  autoComplete="off"
                  required
                />
                <label
                  className={`floating-label${formData.lastName ? " filled" : ""}`}
                  htmlFor="lastName"
                >
                  Last name
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                id="email"
                required
              />
              <label className={`floating-label${formData.email ? " filled" : ""}`} htmlFor="Email">
                Email Adress
              </label>
            </div>
          </div>

          <div className="form-group password-group">
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input password-input"
                required
                minLength={8}
              />
              <label
                className={`floating-label${formData.password ? " filled" : ""}`}
                htmlFor="Password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <Eye className="eye-icon" /> : <EyeOff className="eye-icon" />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input password-input"
                required
              />
              <label
                className={`floating-label${formData.confirmPassword ? " filled" : ""}`}
                htmlFor="ConfirmPassword"
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? (
                  <Eye className="eye-icon" />
                ) : (
                  <EyeOff className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-switch-text">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="auth-switch-link" type="button">
              Sign in here
            </button>
          </p>
        </div>

        <button onClick={() => navigate("/")} className="back-home-btn" type="button">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default SignUpPage;
