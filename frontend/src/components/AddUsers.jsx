import React, { useState, useEffect } from "react";
import "./AddUsers.css"
const AddUsers = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students when the component mounts
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:8080/user/all", {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `${token}` // Make sure to include 'Bearer' if it's a JWT
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data.students || []); // Ensuring data.students is always an array
        } else {
          console.error('Failed to fetch students:', response.statusText);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Handle delete action
  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/user/${userId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${token}`, // Authorization header to pass token
        },
      });

      if (response.ok) {
        setStudents(students.filter(student => student._id !== userId));
      } else {
        console.error('Failed to delete user:', response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle update action
  const handleUpdate = async (userId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`, // Authorization header to pass token
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setStudents(students.map(student =>
          student._id === userId ? { ...student, ...updatedData } : student
        ));
      } else {
        console.error('Failed to update user:', response.statusText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Render the students in a table format
  const renderTable = () => {
    return (
      <div className="table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student._id}>
                  <td>{student.email}</td>
                  <td>{student.role}</td>
                  <td>
                    <button
                      onClick={() => handleUpdate(student._id, { role: 'Admin' })}
                      className="update-button"
                    >
                      Update Role
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-students">No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="heading">All Students</h2>
      {loading ? <p>Loading...</p> : renderTable()}
    </div>
  );
};

export default AddUsers;