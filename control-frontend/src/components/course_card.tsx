// CourseCard.tsx
import React from 'react';
import { Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => (
  <Card sx={{ 
      width: 345, // Fixed width
      height: 180, // Fixed height
      margin: 'auto',
      display: 'flex', // Ensure card is a flex container
      flexDirection: 'column', // Stack children vertically
      "&:hover": { boxShadow: 6 }
  }}>
    <CardActionArea onClick={onClick} sx={{
        display: 'flex', // Make CardActionArea a flex container
        flex: '1 0 auto', // Allow it to expand to fill the card
        flexDirection: 'column', // Stack children vertically
    }}>
      <CardContent sx={{
          flex: '1 0 auto', // Allow content to expand and fill available space
      }}>
        <Typography gutterBottom variant="h5" component="div" noWrap>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2, // Limit text to 2 lines
          }}>
          {course.description}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default CourseCard;
