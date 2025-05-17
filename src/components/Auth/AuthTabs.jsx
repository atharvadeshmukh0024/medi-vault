// src/components/Auth/AuthTabs.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import '../../styles/auth.css';

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="auth-container">
      <div className="tab-buttons">
        <button
          className={`tab ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          Signup
        </button>
      </div>

      <div className="form-container">
        {activeTab === 'login' ? <LoginForm /> : <SignupForm />}
      </div>

      <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
          Back to Home
        </Link>
      </p>
    </div>
  );
};

export default AuthTabs;
