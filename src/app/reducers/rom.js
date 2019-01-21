import {LOAD_ROM} from 'chip8/app/actions/rom.js';


export default (state = {}, action) => {
    switch (action.type) {
        case LOAD_ROM:
            return Object.assign({}, state, {
                romLoaded: true,
                name: action.rom.name,
                data: action.rom.data
            });
    }

    return state;
};