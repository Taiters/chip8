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

    all(): {[string]: Project} {
        const serialized = this.store.getItem(PROJECTS_KEY);
        if (serialized != null)
            return JSON.parse(serialized);
        
        return {};
    }

    save(project: Project): string {
        const id = project.id || uuidv4();
        const projects = this.all();

        project.id = id;
        projects[id] = project;

        this.store.setItem(PROJECTS_KEY, JSON.stringify(projects));

        return id;
    }

    get(id: string): ?Project {
        const projects = this.all();
        return projects[id];
    }

    getCurrent(): ?string {
        return this.store.getItem(CURRENT_PROJECT);
    }

    clearCurrent() {
        this.store.removeItem(CURRENT_PROJECT);
    }

    setCurrent(id: string) {
        this.store.setItem(CURRENT_PROJECT, id);
    }
}
