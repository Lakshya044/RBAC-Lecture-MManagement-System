// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./Pages/SignIn";
import SignUpPage from "./Pages/SignUp";
import NavBar from "./components/Navbar";
import Homepage from "./Pages/Homepage";
import AdminDashboard from "./Pages/AdminDashboard"
import StudentDashboard from "./Pages/StudentDashboard"
import AdminLecture from "./Pages/AdminLecture"
import StudnetLecture from "./Pages/StudentLecture"

import { useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/user/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${token}`
        },

      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Show success message
        localStorage.clear();
        setIsLoggedIn(false); // Update isLoggedIn state in App component
        window.location.href = '/';
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <BrowserRouter>
        <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/AdminDashboard" element={<AdminDashboard/>} />
          <Route path="/Course/:courseId" element={<AdminLecture/>} />
          <Route path="/Student/:courseId" element={<StudnetLecture/>} />
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
