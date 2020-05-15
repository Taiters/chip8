// @flow
import type { Example } from '../model';

import src from './face.txt';


const face: Example = {
    title: 'Face',
    load: () => fetch(src).then(response => response.text()),
};

export default face;