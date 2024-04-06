import { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import { Course } from '../types';

function Home() {
  const [courseData, setCourseData] = useState<Course | null>(null);

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/modules');
  };

  useEffect(() => {
    const subdomain = window.location.hostname.split('.')[0];
    fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${subdomain}`)
      .then((response) => response.json())
      .then((data) => setCourseData(data));
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" component="h1" gutterBottom>
        {courseData?.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {courseData?.description}
      </Typography>
      <br />
      <Button variant="contained" color="primary" onClick={handleGetStarted}>
        Get Started
      </Button>
    </Container>
  );
}

export default Home;
