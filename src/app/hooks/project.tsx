import {
    useState,
    useEffect,
    useRef,
} from 'react';
import { createUseStyles } from 'react-jss';

import { getExamples, loadExample } from 'chip8/app/projects';
import ProjectStore from 'chip8/app/projects/store';
import { Project } from 'chip8/app/projects/model';
import Modal from 'chip8/components/modal';

const useStyles = createUseStyles({
    container: {
        textAlign: 'right',
    },
    button: {
        border: 'none',
        padding: 'none',
        textAlign: 'center',
        color: '#fbf3e3',
        backgroundColor: '#5b5545',
        fontSize: '1.1em',
        fontFamily: 'monospace',
        cursor: 'pointer',
        margin: [[0, 2]],
        width: 80,

        '&:hover': {
            color: '#26261F',
            backgroundColor: '#ebdab4',
        }
    },
});

const CHIP8_PROJECT_TYPE: FilePickerAcceptType = {
    description: 'CHIP-8 Project File',
    accept: { 'text/plain': ['.ch8project'] },
};

const filename = (handle: FileSystemHandle): string => handle.name.replace(/\.[^/.]+$/, "");

export default function useProject(projectStore: ProjectStore) {
    const classes = useStyles();
    const [project, setProject] = useState<Project | null>(null);
    const [confirmSaveModal, setConfirmSaveModal] = useState(null);
    const confirmSaveCb = useRef();

    useEffect(() => {
        const existingProject = projectStore.get();
        if (existingProject) {
            setProject(existingProject);
            return;
        }

        const examples = getExamples();
        loadExample(examples[0]).then(setProject);
    }, []);

    useEffect(() => {
        if (project) {
            projectStore.save(project);
        }
    }, [project]);

    const saveAsProject = project?.code != null ? async () => {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: `${project.title}`,
                types: [CHIP8_PROJECT_TYPE],
            });

            const writeable = await handle.createWritable();
            await writeable.write(project.code);
            await writeable.close();

            setProject(project => ({
                ...project,
                title: filename(handle),
                file: handle,
                unsavedChanges: false,
            }));
        } catch (err) {
            console.error(err);
        }
    } : null;

    const saveProject = project?.file != null ? async () => {
        try {
            const writeable = await project.file.createWritable();
            await writeable.write(project.code);
            await writeable.close();
            setProject(project => ({...project, unsavedChanges: false}));
        } catch (err) {
            console.error(err);
        }
    } : null;

    const openProject = async () => {
        confirmSave(async () => {
            try { 
                const [handle] = await window.showOpenFilePicker({
                    types: [CHIP8_PROJECT_TYPE],
                    multiple: false,
                });
                const file = await handle.getFile();
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    setProject({
                        title: filename(handle),
                        code: reader.result,
                        file: handle,
                    });
                });
                reader.readAsText(file);
            } catch (err) {
                console.log(err);
            }
        });
    }

    const confirmSave = (cb) => {
        if (project.unsavedChanges) {
            confirmSaveCb.current = cb;
        } else {
            cb();
        }
    }

    useEffect(() => {
        if (confirmSaveCb.current == null) {
            setConfirmSaveModal(null);
            return;
        }

        const onNo = () => {
            confirmSaveCb.current();
            confirmSaveCb.current = null;
        }

        const onYes = async () => {
            if (saveProject != null) {
                await saveProject();
            } else {
                await saveAsProject();
            }
            confirmSaveCb.current();
            confirmSaveCb.current = null;
        }

        setConfirmSaveModal(
            <Modal visible={true} title="Unsaved changes" onClose={() => confirmSaveCb.current = null}>
                <p>It looks like you have unsaved changes.</p>
                <p>Do you want to save before continuing?</p>
                <div className={classes.container}>
                    <button className={classes.button} onClick={onNo}>No</button>
                    <button className={classes.button} onClick={onYes}>Yes</button>
                </div>
            </Modal>
        )
    }, [confirmSaveCb.current, saveAsProject, saveProject]);

    return [project, setProject, saveAsProject, saveProject, openProject, confirmSave, confirmSaveModal];
}