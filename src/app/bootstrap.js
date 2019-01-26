import jss from 'jss';
import preset from 'jss-preset-default';
import { onKeyDown, onKeyUp } from 'chip8/app/input.js';
import { initialize, tick, play, decrementCounters } from 'chip8/app/actions/cpu.js';
import { setRoms } from 'chip8/app/actions/roms.js';
import roms from 'chip8/app/clients/roms.js';
import beep from 'chip8/sound/beep.js';


const setupStyles = () => {
    jss.setup(preset());
    jss.createStyleSheet({
        '@global': {
            'body, html': {
                backgroundColor: '#3f3f3f',
                padding: 0,
                margin: 0,
                fontFamily: ['VT323', 'monospace'],
            },
        }
    }).attach();
};

const setupInput = () => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
};

const setupRomListeners = (store) => {
    let currentRom = store.getState().roms.current;
    store.subscribe(() => {
        let previousRom = currentRom;
        const state = store.getState();
        currentRom = state.roms.current;

        if (previousRom == currentRom)
            return;
        
        const selectedRom = state.roms.list[currentRom];
        roms.downloadRom(selectedRom.path, (data) => {
            store.dispatch(initialize(data));
            store.dispatch(play());
        });
    });
};

const setupCpuIntervals = (store) => {
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

const setupCpuBeep = (store) => {
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

const setupCpuListeners = (store) => {
    setupCpuIntervals(store);
    setupCpuBeep(store);
};

const bootstrap = (store) => {
    setupStyles();
    setupInput(store);
    setupRomListeners(store);
    setupCpuListeners(store);

    roms.listRoms((roms) => {
        store.dispatch(setRoms(roms));
    });
};

export default bootstrap;