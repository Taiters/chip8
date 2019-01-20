import { combineReducers } from 'redux';
import cpu from './cpu.js';
import rom from './rom.js';


export default combineReducers(({
    cpu,
    rom
}));