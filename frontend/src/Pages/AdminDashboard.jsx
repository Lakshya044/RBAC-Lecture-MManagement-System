import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";
import AddUsers from "../components/AddUsers";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: "",
    description: "",
  });
  const [updatingCourse, setUpdatingCourse] = useState({
    _id: "",
    name: "",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Use effect to check role and set admin status
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    console.log("role", role);
    if (role === "Admin") {
      setIsAdmin(true);
    }
  }, []);

  // Fetch courses after admin check
  useEffect(() => {
    if (isAdmin) {
      const fetchCourseDetails = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8080/course/getAllCourse`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setCourses(data.courses);
          } else {
            setError(data.message);
          }
        } catch (error) {
          console.log(error);
          setError("Failed to load courses");
        } finally {
          setLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [isAdmin]); // Trigger when isAdmin changes

  if (!isAdmin) {
    return null; // Optionally show a loading spinner or redirect if needed
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/course/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(newCourse),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setCourses((prevCourses) => [...prevCourses, data.newCourse]);
        setIsCreating(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/course/${courseId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewCourse({
      name: "",
      description: "",
    });
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
  };

  const handleUpdateClick = (course) => {
    setIsUpdating(true);
    setUpdatingCourse(course);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/course/${updatingCourse._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(updatingCourse),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === updatingCourse._id ? updatingCourse : course
          )
        );
        setIsUpdating(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course &&
      course.name &&
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <div className="AdminDashboard-container">
        <h1>Welcome Admin</h1>
        <div>
          <p>Total Courses: {courses.length}</p>
        </div>
        <div className="dashboard-actions">
          <button onClick={() => setIsCreating(true)}>Add New Course</button>
          <input
            type="text"
            placeholder="Search Course"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {isCreating && (
          <div className="Create-form">
            <form onSubmit={handleCreateCourse}>
              <input
                type="text"
                placeholder="Course Name"
                name="name"
                value={newCourse.name}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Course Description"
                name="description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
              />
              <button type="submit">Create</button>
              <span
                className="cancel-icon"
                type="button"
                onClick={handleCancelCreate}
              >
                X
              </span>
            </form>
          </div>
        )}
        {isUpdating && (
          <div className="update-form">
            <form onSubmit={handleUpdateCourse}>
              <input
                type="text"
                name="name"
                value={updatingCourse.name}
                onChange={(e) =>
                  setUpdatingCourse({ ...updatingCourse, name: e.target.value })
                }
              />
              <input
                type="text"
                name="description"
                value={updatingCourse.description}
                onChange={(e) =>
                  setUpdatingCourse({
                    ...updatingCourse,
                    description: e.target.value,
                  })
                }
              />
              <button type="submit">Update</button>
              <span className="cancel-icon" onClick={handleCancelUpdate}>
                X
              </span>
            </form>
          </div>
        )}
        {loading && <p>Loading courses...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="courses-list">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-item">
              <Link to={`/Course/${course._id}`}>
                <h2>{course.name}</h2>
                <p>{course.description}</p>
                <p>
                  Total Lectures: {course.lectures ? course.lectures.length : 0}
                </p>
              </Link>
              <div className="action-buttons">
                <button onClick={() => handleUpdateClick(course)}>
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteCourse(course._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddUsers />
    </div>
  );
};

export default AdminDashboard;
