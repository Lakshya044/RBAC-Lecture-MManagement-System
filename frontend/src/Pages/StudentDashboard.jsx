import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedForAdding, setSelectedForAdding] = useState([]);

  const checkIfSelected = async () => {
    const userId = localStorage.getItem("userId");
    console.log(localStorage);
    console.log("userId",userId);
    if (!userId) {
      alert("Please login to continue.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/user/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      });
       console.log("response",response)
      if (!response.ok) {
        throw new Error("Authentication failed or user not found.");
      }
  
      const data = await response.json();
      setIsSelected(data.isSelected);
  
      if (data.isSelected) {
        setSelectedCourses(data.courses || []);
      } else {
        setSelectedCourses([]);
      }
  
    } catch (error) {
      console.error(error);
      alert("Error checking selection status.");
    }
  };
  // Function to fetch all available courses
  const fetchAllCourses = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to continue.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/course/getAllCourse", {
        method: 'GET', // Changed from POST to GET
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`, // Make sure to prefix token with 'Bearer '
        },
      });
  
      if (!response.ok) {
        throw new Error("Error fetching courses.");
      }
  
      const data = await response.json();
      setAllCourses(data.courses || []);
    } catch (error) {
      console.error(error);
      alert("Error fetching courses.");
    }
  };
  
  console.log("all",allCourses)
  useEffect(() => {
    checkIfSelected(); // Check if user has selected courses
    fetchAllCourses(); // Get all courses to show
  }, []);

  const handleCourseSelection = (courseId) => {
    setSelectedForAdding((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        // If the course is already selected, remove it
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        // If the course is not selected, add it to the list
        return [...prevSelectedCourses, courseId];
      }
    });
  };
  
  

  const handleSubmit = async () => {
    if (selectedForAdding.length === 0) {
      alert("Please select at least one course.");
      return;
    }
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login to continue.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/user/add-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          userId: userId,
        courseIds: selectedForAdding,
        }),
      });

      if (!response.ok) {
        throw new Error("Error adding courses. Please try again.");
      }

      const data = await response.json();
      alert(data.message);

      if (data.success) {
        setIsSelected(true);
        localStorage.setItem("isSelected", "true");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding courses:", error);
      alert("Error adding courses.");
    }
  };

    return (
      <div>
        <div className="student-dashboard-container">
          {isSelected ? (
            <div>
              <h1>My Courses</h1>
              {selectedCourses.length > 0 ? (
                selectedCourses.map((course) => (
                  <Link key={course._id} to={`/Student/${course._id}`} className="course-link">
                    <h2>{course.name}</h2>
                    <p className="description">Description: {course.description}</p>
                    <p className="lectures">Total Lectures: {course.lectures.length}</p>
                  </Link>
                ))
              ) : (
                <p>No selected courses.</p>
              )}
            </div>
          ) : (
            <h1>No courses selected yet</h1>
          )}
  
          <h2>Select Courses to Add</h2>
          <ul className="course-list">
            {allCourses.length > 0 ? (
              allCourses.map((course) => (
                <li key={course._id} className="course-item">
                  <label className="course-label">
                    <input
                      type="checkbox"
                      checked={selectedForAdding.includes(course._id)}
                      onChange={() => handleCourseSelection(course._id)}
                    />
                    <div className="course-info">
                      <h2 className="course-name">{course.name}</h2>
                      <p className="course-description">{course.description}</p>
                    </div>
                  </label>
                </li>
              ))
            ) : (
              <p>No available courses.</p>
            )}
          </ul>
  
          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>
      </div>
    );
  };

export default StudentDashboard;
