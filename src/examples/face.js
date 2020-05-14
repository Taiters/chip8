// @flow
import type { Project } from 'chip8/app/projects';

import src from './face.txt';


const face: Project = {
    id: 'example_face',
    title: 'Face',
    loadCode: () => fetch(src).then(response => response.text()),
};

export default face;