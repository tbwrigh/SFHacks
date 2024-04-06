import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, TextField, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// import { ColorPicker } from '@mui/x-date-pickers/ColorPicker'; // Adjust based on the color picker you choose

import { CourseData } from '../types';

const Input = styled('input')({
  display: 'none',
});

const steps = ['Course Details', 'Additional Information', 'Assets'];

export default function CourseCreateEditForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    subdomain: '',
    icon: undefined,
    primaryColor: '#ffffff',
    secondaryColor: '#000000'
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({ ...courseData, [event.target.name]: event.target.value });
};

const StepContent = ({ stepIndex }: { stepIndex: number }) => {
    switch (stepIndex) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={courseData.title}
              onChange={handleFieldChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={courseData.description}
              onChange={handleFieldChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subdomain"
              name="subdomain"
              value={courseData.subdomain}
              onChange={handleFieldChange}
              margin="normal"
            />
          </Box>
        );
      case 1:
        return <Typography>Additional information can be added here.</Typography>;
      case 2:
        return (
        <Box>
            <label htmlFor="icon-upload">
                <Input
                    accept="image/*"
                    id="icon-upload"
                    type="file"
                    onChange={(event) => 
                        setCourseData({ ...courseData, icon: event.target.files ? event.target.files[0] : undefined })}
                />
                <Button variant="contained" component="span">
                    Upload Icon
                </Button>
            </label>
            {/* Implement ColorPicker for primaryColor and secondaryColor */}
        </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
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
                color="inherit"
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