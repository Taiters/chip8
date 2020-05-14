// @flow
import examples from 'chip8/examples';


export type Project = {
    id: string,
    title: string,
    loadCode(): Promise<string>,
};

export function listProjects(): Array<Project> {
    return examples;
}

export function getProject(id: string): Project {
    const projects = listProjects();

    for (const project of projects) {
        if (project.id === id) {
            return project;
        }
    }

    throw `Project not found: ${id}`;
}