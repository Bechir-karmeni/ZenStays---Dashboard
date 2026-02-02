import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [form, setForm] = useState({ password: "", confirm: "", first_name: "", last_name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:8000";

  useEffect(() => {
    if (!token) setError("Missing invite token in URL.");
  }, [token]);

  // Helper to extract error message from API response
  function getErrorMessage(err) {
    if (!err) return "Something went wrong.";

    // Check for detail field
    if (err.detail) {
      return Array.isArray(err.detail) ? err.detail[0] : err.detail;
    }

    // Check for token field errors
    if (err.token) {
      return Array.isArray(err.token) ? err.token[0] : err.token;
    }

    // Check for password field errors
    if (err.password) {
      return Array.isArray(err.password) ? err.password[0] : err.password;
    }

    // Check for non_field_errors
    if (err.non_field_errors) {
      return Array.isArray(err.non_field_errors) ? err.non_field_errors[0] : err.non_field_errors;
    }

    // Fallback: stringify first value found
    const firstKey = Object.keys(err)[0];
    if (firstKey) {
      const val = err[firstKey];
      return Array.isArray(val) ? val[0] : val;
    }

    return "Something went wrong.";
  }

  async function acceptInvite(e) {
    e.preventDefault();
    setError("");

    if (!token) return setError("Missing invite token in URL.");
    if (!form.password || !form.confirm) return setError("Enter and confirm your password.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/invites/accept/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: form.password,
          first_name: form.first_name || "",
          last_name: form.last_name || "",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(getErrorMessage(data));
      }

      alert("Account created! Please sign in.");
      navigate("/login");
    } catch (e) {
      setError(e.message || "Failed to accept invite.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Accept Invite</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>Set your password to activate your account.</p>

      {/* Show token for debugging */}
      {token && (
        <p style={{ fontSize: 12, color: "#94a3b8", wordBreak: "break-all" }}>Token: {token}</p>
      )}

      <form onSubmit={acceptInvite} style={{ display: "grid", gap: 12 }}>
        <label>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
            First name (optional)
          </div>
          <input
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            style={{
              height: 40,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
            Last name (optional)
          </div>
          <input
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            style={{
              height: 40,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Password</div>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            minLength={8}
            style={{
              height: 40,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          />
        </label>

        <label>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Confirm Password</div>
          <input
            type="password"
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            required
            style={{
              height: 40,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          />
        </label>

        {error && (
          <div
            style={{
              color: "#b91c1c",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: 10,
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !token}
          style={{
            height: 42,
            borderRadius: 10,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            cursor: submitting || !token ? "not-allowed" : "pointer",
            opacity: submitting || !token ? 0.6 : 1,
          }}
        >
          {submitting ? "Activating…" : "Activate Account"}
        </button>
      </form>
    </div>
  );
}
