import {createStore, combineReducers} from 'redux';
import cpu from './cpu';
import rom from './rom';

export default createStore(combineReducers({
    cpu,
    rom
}), {});