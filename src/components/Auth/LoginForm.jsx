// src/components/Auth/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../services/authService";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const user = await signInUser(email, password); //  Call Cognito
      console.log("✅ Logged in user:", user);
      alert("Login successful");
      navigate("/dashboard"); // ✅ Go to dashboard
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        className="input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="form-button">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
