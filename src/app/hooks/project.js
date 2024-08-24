import {
    useState,
    useEffect,
} from 'react';

import { getExamples, loadExample } from 'chip8/app/projects';


const isNewProject = (project) => project.user && project.id == null;
const isPersistedProject = (project) => project.rom != null;

export default function useProject(projectStore) {
    const [project, setProject] = useState({});

    useEffect(() => {
        const currentProjectId = projectStore.getCurrent();

        if (currentProjectId != null) {
            const currentProject = projectStore.get(currentProjectId);
            if (currentProject != null) {
                setProject(currentProject);
                return;
            } else {
                projectStore.clearCurrent();
            }
        }

        const examples = getExamples();
        loadExample(examples[0]).then(setProject);
    }, []);

    useEffect(() => {
        if (isNewProject(project) && isPersistedProject(project)) {
            const id = projectStore.save(project);
            projectStore.setCurrent(id);

            setProject((project) => ({...project, id}));

            console.log('Saved new project'); // eslint-disable-line no-console
        }
        
    }, [project]);

    return [project, setProject];
}