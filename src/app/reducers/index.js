import { combineReducers } from 'redux';
import cpu from './cpu.js';
import roms from './roms.js';


export default combineReducers(({
    cpu,
    roms,
}));