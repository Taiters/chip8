import {
    useState,
    useEffect,
} from 'react';

import { projectStore, getExamples, loadExample } from 'chip8/app/projects';


export default function useProject() {
    const [project, setProject] = useState({});

    useEffect(() => {
        const currentProjectId = projectStore.current();

        if (currentProjectId != null) {
            setProject(projectStore.get(currentProjectId));
            return;
        }

        const examples = getExamples();
        loadExample(examples[0]).then(setProject);
    }, []);

    return [project, setProject];
}