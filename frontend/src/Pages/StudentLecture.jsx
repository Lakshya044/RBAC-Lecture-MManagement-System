import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const StudentLecture = () => {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState([]);
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

  const filteredLectures = lectures.filter(lecture => {
    return lecture.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="StudentLecture-container">
      <div>
        <h1>Total Lectures: {filteredLectures.length}</h1>
        <input
          type="text"
          placeholder="Search Lecture"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="lectures-list">
        {filteredLectures.map(lecture => (
          <div key={lecture._id} className="lecture-item">
            <h2>{lecture.title}</h2>
            <p>{lecture.description}</p>
            <p>{new Date(lecture.startTime).toLocaleDateString()}</p>
            <p>{lecture.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentLecture;
