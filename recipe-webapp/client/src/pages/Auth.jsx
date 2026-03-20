import React, { useState } from "react";
import { loginUser, registerUser } from "../api/auth";
import { setAuthToken } from "../api/client";

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedUsername = username.trim().toLowerCase();
    if (!normalizedUsername || !password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = { username: normalizedUsername, password };
      const result = isLogin ? await loginUser(payload) : await registerUser(payload);
      setAuthToken(result.token);
      onAuthenticated?.(result.user);
      setPassword("");
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>{isLogin ? "Login" : "Create Account"}</h1>
      <p className="muted">
        Create a username/password account, then you can publish recipes publicly under your username.
      </p>

      {error && (
        <p style={{
          color: '#ff6b6b',
          padding: '12px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderLeft: '4px solid #ff6b6b',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          ❌ {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '420px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: '600', color: 'var(--nau-gold)' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: '16px' }}>
        {isLogin ? "Need an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setError("");
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--nau-gold)',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0
          }}
        >
          {isLogin ? "Create one here" : "Log in here"}
        </button>
      </p>
    </div>
  );
}
