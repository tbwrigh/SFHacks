// CourseList.tsx adjustments
import React from 'react';
import { Grid } from '@mui/material';
import CourseCard from './course_card';
import { Course } from '../types';
import { useNavigate } from 'react-router-dom';

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={4} justifyContent="center">
    {courses.map((course, index) => (
      <Grid item key={index} xs={12} sm={8} md={6} lg={6}>
        {/* Adjust grid item sizes for wider cards */}
        <CourseCard
          course={course}
          onClick={() => navigate(`/edit/${course.subdomain}`)}
        />
      </Grid>
    ))}
  </Grid>
  )
}



export default CourseList;
