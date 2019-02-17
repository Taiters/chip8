export const SET_FOCUS = 'SET_FOCUS';
export const SET_SRC = 'SET_SRC';

export const setFocus = (focused) => ({
    type: SET_FOCUS,
    focused
});

export const setSrc = (src) => ({
    type: SET_SRC,
    src
});