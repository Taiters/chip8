import type { Project } from './model';


const PROJECT_KEY = 'current_project';

const serializeROM = (rom: Uint8Array): string => {
    return rom.toString();
}

const deserializeROM = (romStr: string): Uint8Array => {
    return new Uint8Array(romStr.split(',').map(i => parseInt(i)));
}

export default class ProjectStore {
    store: Storage
    constructor(store: Storage) {
        this.store = store;
    }

    save(project: Project) {
        const code = project.code;
        const rom = project.code == null ? serializeROM(project.rom) : null;

        this.store.setItem(PROJECT_KEY, JSON.stringify({
            title: project.title,
            code,
            rom,
        }));
    }

    get(): Project | null {
        const item = this.store.getItem(PROJECT_KEY);
        if (item == null) {
            return null;
        }

        try {
            const deserialized = JSON.parse(item);
            return {
                ...deserialized,
                rom: deserialized.rom != null ? deserializeROM(deserialized.rom) : null,
            }
        } catch {
            return null;
        }
    }
}
