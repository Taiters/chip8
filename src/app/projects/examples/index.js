// @flow
import face from './face';
import type { Example, Project } from '../model';


const examples = new Map<string, Example>();
examples.set(face.title, face);


export function getExamples(): Array<string> {
    return Array.from(examples.keys());
}

export function loadExample(name: string): Promise<?Project> {
    const example = examples.get(name);

    if (example == null)
        return Promise.resolve(null);

    return example.load().then(code => ({
        id: null,
        title: example.title,
        code,
    }));
}