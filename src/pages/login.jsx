// src/pages/login.jsx
import React from 'react';
import AuthTabs from '../components/Auth/AuthTabs';
import '../styles/global.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <AuthTabs />
    </div>
  );
};

export default LoginPage;
