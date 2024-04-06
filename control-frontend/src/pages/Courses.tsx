import React from 'react';
import CourseList from '../components/course_list';
import { Course } from '../types';

const courses: Course[] = [
    {
      title: 'Introduction to JavaScript',
      description: 'Learn the basics of JavaScript',
    },
    {
        title: 'Introduction to Go',
        description: 'Learn the basics of Golang',
      },
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript',
      },
      {
          title: 'Introduction to Go',
          description: 'Learn the basics of Golang',
        },
        {
            title: 'Introduction to JavaScript',
            description: 'Learn the basics of JavaScript',
          },
          {
              title: 'Introduction to Go',
              description: 'Learn the basics of Golang',
            },
    // Add more courses as needed
  ];

const Courses: React.FC = () => {
    const handleNewCourse = () => {
        // Handling stub for creating a new course
        console.log('Creating a new course...');
    };

    return (
        <div>
            <h1>Courses</h1>
            <CourseList courses={courses}/>
            <br />
            <button onClick={handleNewCourse}>New Course</button>
        </div>
    );
};

export default Courses;