import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface NewDialogProps {
    onSubmit: () => void;
}

function NewDialog(props: NewDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    courseDescription: '',
    subdomainName: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setFormData({
        courseName: '',
        courseDescription: '',
        subdomainName: '',
    });
    setOpen(false);
  }

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};

const handleSubmit = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/course`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            name: formData.courseName,
            description: formData.courseDescription,
            subdomain: formData.subdomainName,
        }),
    }).then((response) => {
        if (response.ok) {
            console.log('Course created');
            setFormData({
                courseName: '',
                courseDescription: '',
                subdomainName: '',
            });
        
            props.onSubmit();

            setOpen(false);
        } else {
            console.error('Error creating course');
        }
    })
};

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        New Course
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Course Information</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="courseName"
            label="Course Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.courseName}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="courseDescription"
            label="Course Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={formData.courseDescription}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="subdomainName"
            label="Subdomain Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.subdomainName}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewDialog;
