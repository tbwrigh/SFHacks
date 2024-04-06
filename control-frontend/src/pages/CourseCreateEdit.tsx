import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, Box, Typography } from '@mui/material';
// import { ColorPicker } from '@mui/x-date-pickers/ColorPicker'; // Adjust based on the color picker you choose
import { useLocation, useNavigate } from 'react-router-dom';

import { CourseData } from '../types';
import ColorPicker from '../components/color_picker';


const steps = ['Course Details', 'Additional Information', 'Assets'];

export default function CourseCreateEditForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    name: '',
    description: '',
    subdomain: '',
    icon: undefined,
    iconPreview: undefined,
    primaryColor: '#ffffff',
    secondaryColor: '#000000'
  });
  const location = useLocation();
  const subdomain = location.pathname.split('/').pop();
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({ ...courseData, [event.target.name]: event.target.value });
};

const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setCourseData({ 
        ...courseData, 
        icon: file, 
        iconPreview: URL.createObjectURL(file) // Generate and store the preview URL
      });
    }
  };

  useEffect(() => {
    if (subdomain) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${subdomain}`)
        .then((response) => response.json())
        .then((data) => setCourseData({
          ...courseData,
          ...data
        }))
        .catch((error) => console.error('Error:', error));
    }else {
      navigate('/courses');
    }
  }, [])

  

const StepContent = ({ stepIndex }: { stepIndex: number }) => {
    switch (stepIndex) {
      case 0:
        return (
          <Box p={3}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={courseData.name}
              onChange={handleFieldChange}
              margin="normal"
              disabled={true}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={courseData.description}
              onChange={handleFieldChange}
              margin="normal"
              disabled={true}
            />
            <TextField
              fullWidth
              label="Subdomain"
              name="subdomain"
              value={courseData.subdomain}
              onChange={handleFieldChange}
              margin="normal"
              disabled={true}
            />
          </Box>
        );
      case 1:
        return (
            <Box p={3}>            
                <Typography>Additional information can be added here.</Typography>
            </Box>
        )
      case 2:
        return (
        <Box p={3}>
            <label htmlFor="icon-upload">
                <input
                accept="image/*"
                id="icon-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleIconChange}
                />
                <Button variant="contained" component="span">
                Upload Icon
                </Button>
            </label>
            {courseData.iconPreview && (
                <Box sx={{ margin: '10px 0', textAlign: 'center' }}>
                <img src={courseData.iconPreview} alt="Icon Preview" style={{ maxHeight: '100px' }} />
                </Box>
            )}
            <ColorPicker
                label="Primary Color"
                color={courseData.primaryColor}
                onChange={(color) => setCourseData({ ...courseData, primaryColor: color })} />
            <ColorPicker
                label="Secondary Color"
                color={courseData.secondaryColor}
                onChange={(color) => setCourseData({ ...courseData, secondaryColor: color })} />
        </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '80vw' }} p={5} bgcolor={'white'} borderRadius={2}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleBack}>Back</Button>
          </div>
        ) : (
          <div>
            <StepContent stepIndex={activeStep} />
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </div>
        )}
      </div>
    </Box>
  );
}
