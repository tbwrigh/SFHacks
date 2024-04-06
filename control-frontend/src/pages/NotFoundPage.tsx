import React from 'react';
import { Typography, Container } from '@mui/material';

const NotFoundPage: React.FC = () => {
    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '20vh' }}>
            <Typography variant="h1" component="h1" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" component="p">
                Oops! The page you are looking for does not exist.
            </Typography>
        </Container>
    );
};

export default NotFoundPage;