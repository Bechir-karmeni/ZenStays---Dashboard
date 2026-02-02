import React, { useState } from "react";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AuthPages.css";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const API_BASE = "http://localhost:8000";

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Email and password are required.", {
        position: "top-right",
        theme: "colored",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail || "Login failed");
      }

      const tokens = await res.json();
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("refresh", tokens.refresh);
      localStorage.setItem("authenticated", "true");

      let role = "CLIENT";
      try {
        const meRes = await fetch(`${API_BASE}/api/auth/me/`, {
          headers: { Authorization: `Bearer ${tokens.access}` },
        });
        if (meRes.ok) {
          const me = await meRes.json();
          localStorage.setItem("me", JSON.stringify(me));
          role = me.role || "CLIENT";
        }
      } catch {
        // ignore
      }

      toast.success("Signed in successfully!", { position: "top-right", theme: "colored" });

      // Redirect based on role
      if (role === "ADMIN" || role === "HR") {
        navigate("/dashboard");
      } else {
        navigate("/my-assessments");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        position: "top-right",
        theme: "colored",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Heart className="auth-heart-icon" />
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
                id="email"
                autoComplete="email"
              />
              <label className={`floating-label${formData.email ? " filled" : ""}`} htmlFor="email">
                Email Address
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input password-input"
                required
                id="password"
                autoComplete="current-password"
                minLength={8}
              />
              <label
                className={`floating-label${formData.password ? " filled" : ""}`}
                htmlFor="password"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye className="eye-icon" /> : <EyeOff className="eye-icon" />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button onClick={() => navigate("/")} className="back-home-btn" type="button">
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
