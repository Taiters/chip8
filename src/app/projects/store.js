// @flow
import { v4 as uuidv4 } from 'uuid';

import type { Project } from './model';


const PROJECTS_KEY = 'projects';
const CURRENT_PROJECT = 'current';


export default class ProjectStore {
    store: Storage
    constructor(store: Storage) {
        this.store = store;
    }

    all(): Map<string, Project> {
        const serialized = this.store.getItem(PROJECTS_KEY);
        if (serialized != null)
            return JSON.parse(serialized);
        
        return new Map<string, Project>();
    }

    save(project: Project) {
        const id = project.id || uuidv4();
        const projects = this.all();

        projects.set(id, project);

        this.store.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }

    get(id: string): ?Project {
        const projects = this.all();
        return projects.get(id);
    }

    current(): ?string {
        return this.store.getItem(CURRENT_PROJECT);
    }
}