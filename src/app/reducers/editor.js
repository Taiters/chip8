import { SET_FOCUS, SET_SRC } from 'chip8/app/actions/editor.js';


export default (state = {}, action) => {
    switch (action.type) {
        case SET_FOCUS:
            return Object.assign({}, state, {
                focused: action.focused,
            });
        case SET_SRC:
            return Object.assign({}, state, {
                src: action.src
            });
    }

    return state;
};