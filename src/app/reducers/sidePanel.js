import { SET_VIEW } from 'chip8/app/actions/sidePanel.js';


export default (state = {}, action) => {
    switch (action.type) {
        case SET_VIEW:
            return Object.assign({}, state, {
                view: action.view,
            });
    }

    return state;
};