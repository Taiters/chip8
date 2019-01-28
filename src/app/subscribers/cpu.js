import beep from 'chip8/sound/beep.js';
import { tick, decrementCounters } from 'chip8/app/actions/cpu.js';


const subscribeIntervalListeners = (store) => {
    let tickInterval = null;
    let timerInterval = null;
    let currentlyRunning = store.getState().cpu.running;
    store.subscribe(() => {
        let previouslyRunning = currentlyRunning;
        currentlyRunning = store.getState().cpu.running;

        if (previouslyRunning == currentlyRunning) {
            return;
        }

        if (currentlyRunning) {
            tickInterval = setInterval(() => store.dispatch(tick(), 1000/500));
            timerInterval = setInterval(() => store.dispatch(decrementCounters()), 1000/60);
        } else {
            clearInterval(tickInterval);
            clearInterval(timerInterval);
        }
    });
};

const subscribeSoundListener = (store) => {
    let isBeeping = false;
    store.subscribe(() => {
        const state = store.getState();
        if (state.cpu.sound > 0 && !isBeeping) {
            beep.play();
            isBeeping = true;
        } else if (state.cpu.sound == 0 && isBeeping) {
            beep.stop();
            isBeeping = false;
        }
    });
};

const subscribe = (store) => {
    subscribeIntervalListeners(store);
    subscribeSoundListener(store);
};

export default subscribe;