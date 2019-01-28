import keymap from 'chip8/config/keymap.js';
import { pressKey, releaseKey } from 'chip8/app/actions/cpu.js';


const mapKey = (key) => {
    return keymap.indexOf(key);
};

const attach = (target, store) => {
    target.addEventListener('keydown', (e) => {
        const mappedKey = mapKey(e.key.toLowerCase());
        if (mappedKey == -1)
            return;
        
        e.preventDefault();
        store.dispatch(pressKey(mappedKey));
    });

    target.addEventListener('keyup', (e) => {
        const mappedKey = mapKey(e.key.toLowerCase());
        if (mappedKey == -1)
            return;
        
        e.preventDefault();
        store.dispatch(releaseKey(mappedKey));
    });
};

export default attach;