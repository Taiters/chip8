import store from 'chip8/app/store.js';
import {pressKey, releaseKey} from 'chip8/app/actions/cpu.js';


const keyMap = [
    'x', // 0
    '1', // 1
    '2', // 2
    '3', // 3
    'q', // 4
    'w', // 5
    'e', // 6
    'a', // 7
    's', // 8
    'd', // 9
    'z', // A
    'c', // B
    '4', // C
    'r', // D
    'f', // E
    'v', // F
];

const mapKey = (key) => {
    return keyMap.indexOf(key);
};

const onKeyDown = (e) => {
    const mappedKey = mapKey(e.key.toLowerCase());
    if (mappedKey == -1)
        return;
    
    e.preventDefault();
    store.dispatch(pressKey(mappedKey));
};

const onKeyUp = (e) => {
    const mappedKey = mapKey(e.key.toLowerCase());
    if (mappedKey == -1)
        return;
    
    e.preventDefault();
    store.dispatch(releaseKey(mappedKey));
};

export {
    onKeyDown,
    onKeyUp,
    keyMap,
};