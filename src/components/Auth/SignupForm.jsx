// src/components/Auth/SignupForm.jsx
import React, { useState } from 'react';
import { signUpUser, confirmUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const SignupForm = () => {
  const [step, setStep] = useState("signup"); // "signup" or "confirm"
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await signUpUser(email, password);
      alert("Signup successful! A confirmation code has been sent to your email.");
      setStep("confirm");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed: " + err.message);
    }
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();

    try {
      await confirmUser(email, confirmationCode);
      alert("Account confirmed! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Confirmation failed:", err);
      alert("Confirmation failed: " + err.message);
    }
  };

  return (
    <form className="login-form" onSubmit={step === "signup" ? handleSignupSubmit : handleConfirmSubmit}>
      <h2 className="form-title">
        {step === "signup" ? "Signup Form" : "Confirm Your Email"}
      </h2>

      {step === "signup" && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-field"
          />
        </>
      )}

      {step === "confirm" && (
        <>
          <p className="form-subtext">Enter the 6-digit code sent to <strong>{email}</strong></p>
          <input
            type="text"
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            className="input-field"
          />
        </>
      )}

      <button type="submit" className="form-button">
        {step === "signup" ? "Signup" : "Confirm Code"}
      </button>

      {step === "signup" && (
        <div className="form-footer">
          Already have an account? <a href="/login" className="signup-link">Login</a>
        </div>
      )}
    </form>
  );
};

export default SignupForm;
