import { useEffect, useState } from "react";

import { Course, Module, Material } from "../types";

import { v4 as uuidv4 } from 'uuid';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import { Dialog } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";

import download from 'downloadjs';


function Modules() {
    const [courseData, setCourseData] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);

    const [blob, setBlob] = useState<Blob | null>(null);
    const [filename, setFilename] = useState<string | null>(null);

    const [openPreview, setOpenPreview] = useState(false);

    const subdomain = window.location.hostname.split('.')[0];

    useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${subdomain}`)
        .then((response) => response.json())
        .then((data) => setCourseData(data));
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${subdomain}/module`)
        .then((response) => response.json())
        .then((data) => setModules(data))
        .catch((error) => console.error('Error:', error));
    }, []);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${subdomain}/material`)
        .then((response) => response.json())
        .then((data) => setMaterials(data))
        .catch((error) => console.error('Error:', error));
    }, []);

    const handleClick = (material_id: number) => {
        setOpenPreview(true);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${subdomain}/material/${material_id}`)
        .then( res => res.blob() )
        .then( blob => {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/course/${subdomain}/material/`)
            .then(response => response.json())
            .then(json => {
                let filename = "";
                for (let i = 0; i < json.length; i++) {
                    if (json[i].id === material_id) {
                        filename = json[i].filename;
                        break;
                    }
                }
                // download(blob, filename);
                setBlob(blob);
                setFilename(filename.toLowerCase());
            })
        })
        .catch((error) => console.error('Error:', error));
    }

    const handleClose = () => {
        setBlob(null);
        setFilename(null);
        setOpenPreview(false);
    }

    const handleDownload = () => {
        if (blob && filename) {
            download(blob, filename);
        }
    }

    return (
        <>
            <h1>{courseData?.name}</h1>
            <SimpleTreeView>
                {
                  modules.sort((a, b) => a.position - b.position).map((module) => (
                    <TreeItem itemId={uuidv4()} label={module.name} key={uuidv4()} >
                      {
                        materials.filter((material) => material.module_id === module.id).sort((a,b) => a.position - b.position).map((material) => (
                          <TreeItem itemId={uuidv4()} label={material.name} key={uuidv4()} onClick={() => handleClick(material.id)} />
                        ))
                      }
                    </TreeItem>
                  ))
                }
            </SimpleTreeView>

            <Dialog open={openPreview} >

                <h2>Preview {filename && (`of ${filename}`)}</h2>

                {
                    (blob && filename) ? 
                    (
                        filename.endsWith('.mp4') ? (
                            <video controls>
                                <source src={URL.createObjectURL(blob)} type="video/mp4" />
                            </video>
                        ) 
                        : 
                        filename.endsWith('.mp3') ? (
                            <audio controls>
                                <source src={URL.createObjectURL(blob)} type="audio/mp3" />
                            </audio>
                        )
                        // :
                        // filename.endsWith('.pdf') ? 
                        // (
                        //     <iframe src={URL.createObjectURL(blob)} style={{width: '100%', height: '100%'}}></iframe>
                        // )
                        : 
                        (
                        filename.endsWith('.png') || filename.endsWith('.jpg') 
                            || filename.endsWith('.jpeg') || filename.endsWith('.gif')) ? 
                        (
                            <img src={URL.createObjectURL(blob)} alt={filename} />
                        )
                        :
                        (
                            <p>Unsupported file type</p>
                        )
                    ) : (
                        <CircularProgress />
                    )
                }

                <DialogActions>
                    {
                        blob && filename && (
                            <Button onClick={handleDownload}>Download</Button>
                        )
                    }
                    <Button onClick={handleClose}>Done</Button>
                </DialogActions>    
            </Dialog>
        </>
    );
}

export default Modules;