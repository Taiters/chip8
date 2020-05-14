import {
    useState,
    useEffect,
} from 'react';

import { getProject } from 'chip8/app/projects';


export default function useProject(projectId) {
    const [project, setProject] = useState({projectId});

    useEffect(() => {
        const proj = getProject(projectId);
        setProject(project => ({...project, title: proj.title}));

        proj.loadCode().then(code => {
            setProject(project => ({
                ...project,
                code,
            }));
        });
    }, [projectId]);

    return [project, setProject];
}