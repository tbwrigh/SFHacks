import { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';

import { Course } from '../types';

function Home() {
  const [courseData, setCourseData] = useState<Course | null>(null);

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
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Container>
  );
}

export default Home;
