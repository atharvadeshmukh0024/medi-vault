import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="landing-container">
      <header>
        <Link to="/login" className="login-link">Go to Login</Link>
        <h1>Welcome to <strong>MediVault</strong></h1>
      </header>

      
    </div>
  );
};

export default Home;
