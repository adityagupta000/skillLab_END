// LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const users = [
    { email: "john.doe@example.com", password: "Password123!" },
    { email: "jane.smith@example.com", password: "SecurePass456!" },
    { email: "alice.williams@example.com", password: "AlicePass789!" },
    { email: "bob.johnson@example.com", password: "BobSecure321!" },
  ];

  const isValidUser = (email, password) => {
    return users.some(
      (user) => user.email === email && user.password === password
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!isValidUser(email, password)) {
      setError("Invalid email or password.");
      return;
    }
    setError("");
    navigate("/dashboard"); // Redirect on successful login
  };

  return (
    <div className="login-container">
      <h2>Health Care Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
