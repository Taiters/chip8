import { createStore } from 'redux';
import combinedReducers from 'chip8/app/reducers';
import { getDefaultState } from 'chip8/app/state.js';


export default createStore(combinedReducers, getDefaultState());