import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import "./AdminLecture.css"

const AdminLecture = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newLecture, setNewLecture] = useState({
    course: courseId,
    title: "",
    startTime: "",
    duration: "",
    description: ""
  });
  const [updatingLecture, setUpdatingLecture] = useState({
    _id: '',
    course: courseId,
    title: "",
    startTime: "",
    duration: "",
    description: ""
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/course/${courseId}/lectures`, {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `${token}`
          },
        });
        const data = await response.json();
        if (response.ok) {
          setLectures(data.lectures);
        }
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleCreateLecture = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/lecture/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${token}`
        },
        body: JSON.stringify(newLecture)
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setLectures(prevLectures => [...prevLectures, data.newLecture]);
        setIsCreating(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/lecture/${lectureId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setLectures(prevLectures =>
          prevLectures.filter(lecture => lecture._id !== lectureId)
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error);
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewLecture({
      title: '',
      description: ''
    });
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
  };

  const handleUpdateClick = (lecture) => {
    setIsUpdating(true);
    setUpdatingLecture(lecture);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/lecture/${updatingLecture._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `${token}`
        },
        body: JSON.stringify(updatingLecture)
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setLectures(prevLectures =>
          prevLectures.map(lecture =>
            lecture._id === updatingLecture._id ? updatingLecture : lecture
          )
        );
        setIsUpdating(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error);
    }
  };

  const filteredLectures = lectures.filter(lecture => {
    return lecture.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="AdminLecture-container">
      <h1>Welcome Admin</h1>
      <div>
        <p>Total Lectures: {filteredLectures.length}</p>
        <input
          type="text"
          placeholder="Search Lecture"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button onClick={() => setIsCreating(true)}>Add New Lecture</button>
      {isCreating && (
        <div className="Create-form">
          <form onSubmit={handleCreateLecture}>
            <input type="text" placeholder='title' name="title" value={newLecture.title} onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })} />
            <input type="text" placeholder='description' name="description" value={newLecture.description} onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })} />
            <input type="date" placeholder='startTime' name="startTime" value={newLecture.startTime} onChange={(e) => setNewLecture({ ...newLecture, startTime: e.target.value })} />
            <input type="text" placeholder='duration' name="duration" value={newLecture.duration} onChange={(e) => setNewLecture({ ...newLecture, duration: e.target.value })} />
            <button type="submit">Create</button>
            <span className="cancel-icon" type="button" onClick={handleCancelCreate}>X</span>
          </form>
        </div>
      )}
      {isUpdating && (
        <div className="update-form">
          <form onSubmit={handleUpdateCourse}>
            <input type="text" placeholder='title' name="title" value={updatingLecture.title} onChange={(e) => setUpdatingLecture({ ...updatingLecture, title: e.target.value })} />
            <input type="text" placeholder='description' name="description" value={updatingLecture.description} onChange={(e) => setUpdatingLecture({ ...updatingLecture, description: e.target.value })} />
            <input type="date" placeholder='startTime' name="startTime" value={updatingLecture.startTime} onChange={(e) => setUpdatingLecture({ ...updatingLecture, startTime: e.target.value })} />
            <input type="text" placeholder='duration' name="duration" value={updatingLecture.duration} onChange={(e) => setUpdatingLecture({ ...updatingLecture, duration: e.target.value })} />
            <button type="submit">Submit</button>
            <span className="cancel-icon" onClick={handleCancelUpdate}>X</span>
          </form>
        </div>
      )}
      <div className="lectures-list">
        {filteredLectures.map(lecture => (
          <div key={lecture._id} className="lecture-item">
            <h2>{lecture.title}</h2>
            <p>{lecture.description}</p>
            <p>{new Date(lecture.startTime).toLocaleDateString()}</p>
            <p>{lecture.duration}</p>
            <button onClick={() => handleUpdateClick(lecture)}>Update</button>
            <button onClick={() => handleDeleteLecture(lecture._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLecture;
