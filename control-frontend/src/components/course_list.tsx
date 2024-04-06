// CourseList.tsx adjustments
import React from 'react';
import { Grid } from '@mui/material';
import CourseCard from './course_card';
import { Course } from '../types';

interface CourseListProps {
  courses: Course[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => (
  <Grid container spacing={4} justifyContent="center">
    {courses.map((course, index) => (
      <Grid item key={index} xs={12} sm={8} md={5} lg={4}>
        {/* Adjust grid item sizes for wider cards */}
        <CourseCard
          course={course}
          onClick={() => console.log(`Clicked on ${course.title}`)}
        />
      </Grid>
    ))}
  </Grid>
);

export default CourseList;
