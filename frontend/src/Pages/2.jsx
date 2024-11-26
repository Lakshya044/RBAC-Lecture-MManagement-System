import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import "./StudentDashboard.css"

const StudentDashboard = () => {
  const [isSelected ,setIsSelected] = useState(localStorage.getItem("isSelected"))
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);

  console.log(localStorage.getItem("userRole"));
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        let endpoint = isSelected ? 'http://localhost:8080/user/getcourses' : 'https://http://localhost:8080/course/getAllCourse';


        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `${token}`
          },
        });
        const data = await response.json();
        if (isSelected) {
          setSelectedCourses(data.courses);
        } else {
          setCourses(data.courses);
        }
      } catch (error) {
        console.log(error);
        alert(error)
      }
    };

    fetchCourseDetails();
  }, [isSelected]);

  const handleCourseSelection = (courseId) => {
    // Check if the course is already selected
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      // Check if maximum courses limit is reached
      if (selectedCourses.length < 3) {
        setSelectedCourses([...selectedCourses, courseId]);
      } else {
        alert('You can select up to three courses.');
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/user/add-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${token}`
        },
        body: JSON.stringify({
          courseIds: selectedCourses
        })
      });
      const data = await response.json();
      console.log(data.message);
      alert(data.message);
      
      setIsSelected(true); // Update isSelected state
  
      if (!isSelected) {
        // Update the value to true in localStorage
        localStorage.removeItem("isSelected")
        localStorage.setItem("isSelected", true);
      }
  
      // Move reload inside if statement
      window.location.reload();
    } catch (error) {
      console.error('Error adding courses:', error);
    }
  };
  

  return (
    <div className="student-dashboard-container">
      {isSelected ? (
        <div>
          {selectedCourses.map(course => (
            <Link key={course._id}  to={`/Student/${course._id}`} className="course-link">
              <h2>{course.name}</h2>
              <p>Description: {course.description}</p>
              <p>Total Lectures: {course.lectures.length}</p>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <h1>Select Courses</h1>
          <ul className="course-list">
            {courses.map(course => (
              <li key={course._id}>
                <label className="course-label">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => handleCourseSelection(course._id)}
                  />
                  {course.name}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;