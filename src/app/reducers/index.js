import { combineReducers } from 'redux';

import cpu from './cpu.js';
import roms from './roms.js';
import editor from './editor.js';
import sidePanel from './sidePanel.js';


export default combineReducers(({
    cpu,
    roms,
    editor,
    sidePanel,
}));