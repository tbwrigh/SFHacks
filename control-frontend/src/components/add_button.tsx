import { useEffect, useState } from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Edit, QuestionMark } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { Module, Material, Question } from '../types';

import download from 'downloadjs';

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

interface AddQuestionData {
    question: string;
    answer: string;
    incorrect: string;
    position: number;
    module_id: number;
}

function SpeedDialTooltipOpen(props: SpeedDialActionProps) {
    const [openModuleDialog, setOpenModuleDialog] = useState(false);
    const [openMaterialDialog, setOpenMaterialDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openQuestionsDialog, setOpenQuestionsDialog] = useState(false);

    const [editType, setEditType] = useState(''); // ['module', 'material'
    const [editId, setEditId] = useState(0); // [module_id, material_id
  
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

    const [addQuestionData, setAddQuestionData] = useState<AddQuestionData>({
        question: '',
        answer: '',
        incorrect: '',
        position: 0,
        module_id: 0
    });

    const [modules, setModules] = useState<Module[]>([]); // Add module state
    const [materials, setMaterials] = useState<Material[]>([]); // Add material state
    const [questions, setQuestions] = useState<Question[]>([]); // Add question state

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/module`)
            .then((response) => response.json())
            .then((data) => setModules(data))
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/material`)
            .then((response) => response.json())
            .then((data) => setMaterials(data))
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/question`)
            .then((response) => response.json())
            .then((data) => setQuestions(data))
    }, [])

    const updateAddModuleData = (key: string, value: string | number) => {
        setAddModuleData({
            ...addModuleData,
            [key]: value
        });
    }

    const updateQuestionData = (key: string, value: string | number) => {
        setAddQuestionData({
            ...addQuestionData,
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
      } else if (dialogType === 'edit') {
        setOpenEditDialog(true);
      } else if (dialogType === 'questions') {
        setOpenQuestionsDialog(true)
      }
    };
  
    const handleClose = () => {
        setOpenModuleDialog(false);
        setOpenMaterialDialog(false);
        setOpenEditDialog(false);
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

    const handleDelete = () => {
        if (editType === 'module') {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/module/${editId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(() => {
                props.onModalClose();
                setOpenEditDialog(false);
            })
            .catch((error) => console.error('Error:', error));
        }else if (editType === "question") {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/question/${editId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(() => {
                props.onModalClose();
                setOpenEditDialog(false);
            })
            .catch((error) => console.error('Error:', error));
        } else {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/material/${editId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(() => {
                props.onModalClose();
                setOpenEditDialog(false);
            })
            .catch((error) => console.error('Error:', error));
        }
    }

    const handleDownload = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/material/${editId}`)
        .then( res => res.blob() )
        .then( blob => {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/material/`)
            .then(response => response.json())
            .then(json => {
                let filename = "";
                for (let i = 0; i < json.length; i++) {
                    if (json[i].id === editId) {
                        filename = json[i].filename;
                        break;
                    }
                }
                download(blob, filename);
            })
        })
        .catch((error) => console.error('Error:', error));
    }

    const handleQuestionCancel = () => {
        setOpenQuestionsDialog(false);
        setAddQuestionData({
            question: '',
            answer: '',
            incorrect: '',
            position: 0,
            module_id: 0
        });
    }

    const handleQuestionDone = () => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${props.subdomain}/module/${addQuestionData.module_id}/question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(addQuestionData)
        })
        .then(() => {
            props.onModalClose();
            setOpenQuestionsDialog(false);
            setAddQuestionData({
                question: '',
                answer: '',
                incorrect: '',
                position: 0,
                module_id: 0
            });
        })
        .catch((error) => console.error('Error:', error));
    }
  
    const actions = [
      { icon: <NoteAddIcon />, name: 'Add Module', onClick: () => handleClickOpen('module') },
      { icon: <AddIcon />, name: 'Add Material', onClick: () => handleClickOpen('material') },
      { icon: <QuestionMark />, name: 'Add Questions', onClick: () => handleClickOpen('questions')},
      { icon: <Edit />, name: 'Edit', onClick: () => handleClickOpen('edit')},
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
                    fullWidth
                    onChange={(e) => updateAddMaterialData('module_id', parseInt((e.target.value as string)))}
                >
                    {
                        modules.map((module) => (
                            <MenuItem value={module.id} key={uuidv4()}>{module.name}</MenuItem>
                        ))
                    }
                </Select>
                <br />
                {/* Show file name when uploaded */}
                <label htmlFor="icon-upload">
                    <input
                    id="icon-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => updateAddMaterialData('file', e.target.files![0])}
                    />
                    <br />
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


        <Dialog open={openEditDialog} onClose={handleClose}>
            <DialogTitle>{"Edit Dialog"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Here you can delete or download materials and delete modules.
                </DialogContentText>
                <Select id="module-select"
                        fullWidth
                        onChange={(e) => setEditType(e.target.value as string)}>
                    <MenuItem value="module" selected={editType == "module"}>Module</MenuItem>
                    <MenuItem value="material" selected={editType=="material"}>Material</MenuItem>
                    <MenuItem value="question" selected={editType=="question"}>Question</MenuItem>
                </Select>
                <Select fullWidth onChange={(e) => setEditId(parseInt(e.target.value as string))}>
                    {
                        editType === 'module' ? (
                            modules.map((module) => (
                                <MenuItem value={module.id} key={uuidv4()}>{module.name}</MenuItem>
                            ))
                        ) 
                        : 
                        editType === 'question' ? (
                            questions.map((question) => (
                                <MenuItem value={question.id} key={uuidv4()}>{question.question}</MenuItem>
                            ))
                        ) 
                        :
                        (
                            materials.map((material) => (
                                <MenuItem value={material.id} key={uuidv4()}>{material.name}</MenuItem>
                            ))
                        )
                    }
                </Select>
            </DialogContent>
            <DialogActions>
                {
                    (editType == "module" || editType == "material" || editType == "question") && (
                        <Button onClick={handleDelete}>Delete</Button>
                    )
                }
                {
                    editType == "material" && (
                        <Button onClick={handleDownload}>Download</Button>
                    )
                }
                <Button onClick={handleClose}>Done</Button>
            </DialogActions>
        </Dialog>

        <Dialog open={openQuestionsDialog}>
            <DialogTitle>{"New Question"}</DialogTitle>
            <DialogContent>
                
                <TextField
                    autoFocus
                    margin="dense"
                    id="question"
                    label="Question"
                    type="text"
                    fullWidth
                    value={addQuestionData.question}
                    onChange={(e) => updateQuestionData('question', e.target.value)}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="answer"
                    label="Answer"
                    type="text"
                    fullWidth
                    value={addQuestionData.answer}
                    onChange={(e) => updateQuestionData('answer', e.target.value)}
                />
                
                <TextField
                    autoFocus
                    margin="dense"
                    id="incorrect"
                    label="Incorrect (Comma Separated)"
                    type="text"
                    fullWidth
                    value={addQuestionData.incorrect}
                    onChange={(e) => updateQuestionData('incorrect', e.target.value)}
                />

                <TextField
                    autoFocus
                    margin="dense"
                    id="position"
                    label="Position"
                    type="number"
                    fullWidth
                    value={addQuestionData.position}
                    onChange={(e) => updateQuestionData('position', parseInt(e.target.value))}
                />

                <Select
                    id="module-select"
                    fullWidth
                    onChange={(e) => updateQuestionData('module_id', parseInt(e.target.value as string))}
                >
                    {
                        modules.map((module) => (
                            <MenuItem value={module.id} key={uuidv4()}>{module.name}</MenuItem>
                        ))
                    }
                </Select>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleQuestionCancel}>Cancel</Button>
                <Button onClick={handleQuestionDone}>Done</Button>
            </DialogActions>
        </Dialog>
      </>
    );
  }
  
  export default SpeedDialTooltipOpen;