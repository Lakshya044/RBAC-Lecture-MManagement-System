import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage-container">
      <div className="login-signup-box">
        <h1>Welcome to LMS</h1>
        <p>Please sign in or sign up to continue.</p>
        <Link to="/signin">Sign In</Link>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default Homepage;
