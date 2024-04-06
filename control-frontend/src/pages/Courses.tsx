import React, { useEffect, useState } from 'react';
import CourseList from '../components/course_list';
import { Course } from '../types';
import NewDialog from '../components/new_dialog';


const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/course`)
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error:', error));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Courses</h1>
      { courses.length === 0 && (<p>No Courses Yet</p>) }
      { courses.length>0 && (<CourseList courses={courses}/>) }
      <br />
      <NewDialog onSubmit={fetchCourses} />
    </div>
  );
};

export default Courses;