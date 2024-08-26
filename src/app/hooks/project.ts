import {
    useState,
    useEffect,
} from 'react';

import { getExamples, loadExample } from 'chip8/app/projects';
import ProjectStore from 'chip8/app/projects/store';
import { Project } from 'chip8/app/projects/model';

const CHIP8_PROJECT_TYPE: FilePickerAcceptType = {
    description: 'CHIP-8 Project File',
    accept: { 'text/plain': ['.ch8project'] },
};

const filename = (handle: FileSystemHandle): string => handle.name.replace(/\.[^/.]+$/, "");

export default function useProject(projectStore: ProjectStore) {
    const [project, setProject] = useState<Project | null>(null);

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
        } catch (err) {
            console.error(err);
        }
    } : null;

    const openProject = async () => {
        try{ 
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
    }

    return [project, setProject, saveAsProject, saveProject, openProject];
}