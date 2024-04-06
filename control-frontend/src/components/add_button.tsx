import { useEffect, useState } from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { Module } from '../types';
// Import other components and icons as before

interface SpeedDialActionProps {
    onModalClose: () => void;
    subdomain: string;
}

interface AddModuleData {
    name: string;
    description: string;
    position: number;
}

interface AddMaterialData {
    name: string;
    description: string;
    position: number;
    module_id: number;
    file: File;
}

function SpeedDialTooltipOpen(props: SpeedDialActionProps) {
    const [openModuleDialog, setOpenModuleDialog] = useState(false);
    const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
  
    const [addModuleData, setAddModuleData] = useState<AddModuleData>({
        name: '',
        description: '',
        position: 0
    });

    const [addMaterialData, setAddMaterialData] = useState<AddMaterialData>({
        name: '',
        description: '',
        position: 0,
        module_id: 0,
        file: new File([], '')
    });

    const [modules, setModules] = useState<Module[]>([]); // Add module state

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/module`)
            .then((response) => response.json())
            .then((data) => setModules(data))
    }, [])

    const updateAddModuleData = (key: string, value: string | number) => {
        setAddModuleData({
            ...addModuleData,
            [key]: value
        });
    }

    const updateAddMaterialData = (key: string, value: string | number | File) => {
        setAddMaterialData({
            ...addMaterialData,
            [key]: value
        });
    } 

    const handleClickOpen = (dialogType: string) => {
      if (dialogType === 'module') {
        setOpenModuleDialog(true);
      } else if (dialogType === 'material') {
        setOpenMaterialDialog(true);
      }
    };
  
    const handleClose = () => {
        setOpenModuleDialog(false);
        setOpenMaterialDialog(false);
    };

    const handleAddModule = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/module`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(addModuleData)
        })
        .then(() => {
            props.onModalClose();
            setOpenModuleDialog(false);
        })
        .catch((error) => console.error('Error:', error));
    }

    const handleAddMaterial = () => {
        const formData = new FormData();
        formData.append('name', addMaterialData.name);
        formData.append('position', addMaterialData.position.toString());
        formData.append('file', addMaterialData.file);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/module/${addMaterialData.module_id}/material`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        .then(() => {
            props.onModalClose();
            setOpenMaterialDialog(false);
        })
        .catch((error) => console.error('Error:', error)); 
    }
  
    const actions = [
      { icon: <NoteAddIcon />, name: 'Add Module', onClick: () => handleClickOpen('module') },
      { icon: <AddIcon />, name: 'Add Material', onClick: () => handleClickOpen('material') },
    ];
  
    return (
      <>
        <SpeedDial
          ariaLabel="SpeedDial with dialogs"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
  
        {/* Add Module Dialog */}
        <Dialog open={openModuleDialog} onClose={handleClose}>
          <DialogTitle>{"Add Module"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can add a new module.
            </DialogContentText>
            {/* You can add form elements here */}
            {/* Form with name descr and pos */}
            <form>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    onChange={(e) => updateAddModuleData('name', e.target.value)}
                    value={addModuleData.name}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    onChange={(e) => updateAddModuleData('description', e.target.value)}
                    value={addModuleData.description}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="position"
                    label="Position"
                    type="number"
                    fullWidth
                    onChange={(e) => updateAddModuleData('position', parseInt(e.target.value))}
                    value={addModuleData.position}
                />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddModule}>Add</Button>
          </DialogActions>
        </Dialog>
  
        {/* Add Material Dialog */}
        <Dialog open={openMaterialDialog} onClose={handleClose}>
          <DialogTitle>{"Add Material"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Here you can add new material.
            </DialogContentText>
            {/* Form with name descr pos module and file */}
            <form>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    onChange={(e) => updateAddMaterialData('name', e.target.value)}
                    value={addMaterialData.name}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="position"
                    label="Position"
                    type="number"
                    fullWidth
                    onChange={(e) => updateAddMaterialData('position', parseInt(e.target.value))}
                    value={addMaterialData.position}
                />
                <Select
                    id="module-select"
                    label="Module"
                    fullWidth
                    onChange={(e) => updateAddMaterialData('module_id', parseInt((e.target.value as string)))}
                >
                    {
                        modules.map((module) => (
                            <MenuItem value={module.id} key={uuidv4()}>{module.name}</MenuItem>
                        ))
                    }
                </Select>
                {/* Show file name when uploaded */}
                <label htmlFor="icon-upload">
                    <input
                    accept="image/*"
                    id="icon-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => updateAddMaterialData('file', e.target.files![0])}
                    />
                    <Button variant="contained" component="span">
                        Upload File
                    </Button>
                    {
                        addMaterialData.file.name && (<span>Currently Selected: {addMaterialData.file.name}</span>)
                    }
                </label>

            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddMaterial}>Add</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  
  export default SpeedDialTooltipOpen;