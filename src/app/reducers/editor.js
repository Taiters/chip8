import { SET_FOCUS } from 'chip8/app/actions/editor.js';


export default (state = {}, action) => {
    switch (action.type) {
        case SET_FOCUS:
            return Object.assign({}, state, {
                focused: action.focused,
            });
    }

    return state;
};