import {execute} from 'chip8/app/instructions';
import opcode from 'chip8/app/models/opcode.js';
import {getDefaultCpuState} from 'chip8/app/state.js';
import getFont from 'chip8/app/font.js';
import {
    PRESS_KEY,
    RELEASE_KEY,
    PLAY,
    PAUSE,
    STOP,
    TICK,
    DECREMENT_COUNTERS,
    INITIALIZE
} from 'chip8/app/actions/cpu.js';


const tick = (state) => {
    const copiedState = Object.assign({}, state);
    const nextOpcode = opcode(state.mem[state.pc], state.mem[state.pc + 1]);
    return execute(copiedState, nextOpcode);
};

const initialize = (data) => {
    const state = getDefaultCpuState();
    state.mem.set(getFont());
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
            if (state.running) {
                return tick(state);
            }
            return state;
        case DECREMENT_COUNTERS:
            if (!state.running || (state.delay == 0 && state.sound == 0))
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
            return initialize(action.data);
    }

    return state;
};