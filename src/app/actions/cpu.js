export const PRESS_KEY = 'PRESS_KEY';
export const RELEASE_KEY = 'RELEASE_KEY';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const STOP = 'STOP';
export const TICK = 'TICK';
export const DECREMENT_COUNTERS = 'DECREMENT_COUNTERS';
export const INITIALIZE = 'INITIALIZE';


export const pressKey = (key) => ({
    type: PRESS_KEY,
    key
});

export const releaseKey = (key) => ({
    type: RELEASE_KEY,
    key
});

export const play = () => ({
    type: PLAY
});

export const pause = () => ({
    type: PAUSE
});

export const stop = () => ({
    type: STOP
});

export const tick = () => ({
    type: TICK
});

export const decrementCounters = () => ({
    type: DECREMENT_COUNTERS
});

export const initialize = (data) => ({
    type: INITIALIZE,
    data
});