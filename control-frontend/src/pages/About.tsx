import React from 'react';
import { Typography, Container } from '@mui/material';

const About: React.FC = () => {
    return (
        <Container>
            <Typography variant="h2" align="center" gutterBottom>
                About Page
            </Typography>
            <Typography variant="body1" align="center">
                Welcome to the About page!
            </Typography>
        </Container>
    );
};

export default About;