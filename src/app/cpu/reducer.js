import {
    PRESS_KEY,
    RELEASE_KEY,
    PLAY,
    PAUSE,
    STOP,
    TICK,
    DECREMENT_COUNTERS,
    INITIALIZE
} from './actions.js';
import {execute} from 'chip8/cpu/instructions';
import {opcode} from 'chip8/cpu/opcode.js';


const tick = (state) => {
    const copiedState = Object.assign({}, state);
    const nextOpcode = opcode(state.mem[state.pc], state.mem[state.pc + 1]);
    return execute(copiedState, nextOpcode);
};

const initialize = (data) => {
    const state = {
        running: false,
        i: 0,
        pc: 0x200,
        delay: 0,
        sound: 0,
        keys: Array(16).fill(0),
        gfx: new Array(2048),
        mem: new Uint8Array(4096),
        registers: new Uint8Array(16),
        stack: [],
        drawFlag: false,
        clearFlag: false,
        waitKeyFlag: false,
        waitKeyRegister: null,
    };
    
    state.mem.set(data, state.pc);
    return state;
};

export default (state = {}, action) => {
    if (action.type == PRESS_KEY || action.type == RELEASE_KEY) {
        const keys = state.keys.slice(0);
        const copiedState = Object.assign({}, state, {
            keys
        });

        keys[action.key] = action.type == PRESS_KEY ? 1 : 0;

        if (state.waitKeyFlag && action.type == PRESS_KEY) {
            copiedState.waitKeyFlag = false;
            copiedState.registers = copiedState.registers.slice(0);
            copiedState.registers[copiedState.waitKeyRegister] = action.key;
            copiedState.waitKeyRegister = null;
            copiedState.pc += 2;
        }

        return copiedState;
    }

    switch (action.type) {
        case TICK:
            return tick(state);
        case DECREMENT_COUNTERS:
            if (state.sound == 0 && state.sound == 0)
                return state;

            return Object.assign({}, state, {
                delay: Math.max(0, state.delay - 1),
                sound: Math.max(0, state.sound - 1)
            });
        case PLAY:
            return Object.assign({}, state, {
                running: true
            });
        case PAUSE:
            return Object.assign({}, state, {
                running: false
            });
        case STOP:
            return Object.assign({}, state, {
                running: false
            });
        case INITIALIZE:
            return initialize(action.rom.data);
    }

    return state;
};