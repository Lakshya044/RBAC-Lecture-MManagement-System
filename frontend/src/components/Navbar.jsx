import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

function NavBar({ isLoggedIn, handleLogout }) {
  let userRole = localStorage.getItem("userRole");

  return (
    <nav>
      <div>
        {!isLoggedIn ? (
          <Link to="/">LMS</Link>
        ) : (
          userRole === "Admin" ? (
            <Link to="/AdminDashboard">LMS</Link>
          ) : (
            <Link to="/StudentDashboard">LMS</Link>
          )
        )}
      </div>
      <div>
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/signin">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
