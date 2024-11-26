import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignIn.css';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch('https://rbac-lecture-m-management-system-9wwe-8333mfy55-lakshya1.vercel.app/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
        body: JSON.stringify({ email, password }),
      });
      console.log("response",response);
      const data = await response.json();
      console.log("data", data);
      if (response.ok) {
        alert(data.message);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isSelected', data.user.isSelected);
        localStorage.setItem("userId", data.user._id);
        if (data.user.role === "Admin") {
          window.location.href = '/AdminDashboard';
        } else {
          window.location.href = '/StudentDashboard';
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignIn}>Sign In</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
