export default {
    cls: (state) => {
        state.gfx = new Array(2048);
        state.gfx.fill(0);
        state.clearFlag = true;
        state.pc += 2;
        return state;
    },

    ret: (state) => {
        if (state.stack.length == 0)
            throw 'Stack is empty';

        state.stack = state.stack.slice(0);
        state.pc = state.stack.pop() + 2;
        return state;
    },

    jumpToAddress: (state, opcode) => {
        state.pc = opcode.nnn;
        return state;
    },

    callAddress: (state, opcode) => {
        state.stack = state.stack.slice(0);
        state.stack.push(state.pc);
        state.pc = opcode.nnn;
        return state;
    },

    skipIfVxEqByte: (state, opcode) => {
        const vx = state.registers[opcode.vx];
        state.pc += vx == opcode.nn ? 4 : 2;
        return state;
    },

    skipIfVxNotEqByte: (state, opcode) => {
        const vx = state.registers[opcode.vx];
        state.pc += vx != opcode.nn ? 4 : 2;
        return state;
    },

    skipIfVxEqVy: (state, opcode) => {
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        state.pc += vx == vy ? 4 : 2;
        return state;
    },

    loadByteIntoVx: (state, opcode) => {
        state.registers = state.registers.slice(0);
        state.registers[opcode.vx] = opcode.nn;
        state.pc += 2;
        return state;
    },

    addByteToVx: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const newValue = state.registers[opcode.vx] + opcode.nn;
        state.registers[opcode.vx] = newValue & 0xFF;
        state.pc += 2;
        return state;
    },

    loadVyIntoVx: (state, opcode) => {
        state.registers = state.registers.slice(0);
        state.registers[opcode.vx] = state.registers[opcode.vy];
        state.pc += 2;
        return state;
    },

    or: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        state.registers[opcode.vx] = (vx | vy) & 0xFF;
        state.pc += 2;
        return state;
    },

    and: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        state.registers[opcode.vx] = (vx & vy) & 0xFF;
        state.pc += 2;
        return state;
    },

    xor: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        state.registers[opcode.vx] = (vx ^ vy) & 0xFF;
        state.pc += 2;
        return state;
    },

    addVyToVx: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        const newValue = vx + vy;
        state.registers[0x0F] = newValue > 0xFF ? 1 : 0;
        state.registers[opcode.vx] = newValue & 0xFF;
        state.pc += 2;
        return state;
    },

    subVyFromVx: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        const newValue = vx - vy;
        state.registers[0x0F] = newValue < 0 ? 0 : 1;
        state.registers[opcode.vx] = newValue & 0xFF;
        state.pc += 2;
        return state;
    },

    shr: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vy = state.registers[opcode.vy];
        const leastSignificantBit = vy & 0x01;
        state.registers[0x0F] = leastSignificantBit;
        state.registers[opcode.vx] = vy >> 1;
        state.pc += 2;
        return state;
    },

    subVxFromVy: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        const newValue = vy - vx;
        state.registers[0x0F] = newValue < 0 ? 0 : 1;
        state.registers[opcode.vx] = newValue & 0xFF;
        state.pc += 2;
        return state;
    },

    shl: (state, opcode) => {
        state.registers = state.registers.slice(0);
        const vy = state.registers[opcode.vy];
        const mostSignificantBit = (vy & 0x8000) >> 15;
        state.registers[0x0F] = mostSignificantBit;
        state.registers[opcode.vx] = (vy << 1) & 0xFF;
        state.pc += 2;
        return state;
    },

    skipIfVxNotEqVy: (state, opcode) => {
        const vx = state.registers[opcode.vx];
        const vy = state.registers[opcode.vy];
        state.pc += vx != vy ? 4 : 2;
        return state;
    },

    loadAddressIntoI: (state, opcode) => {
        state.i = opcode.nnn;
        state.pc += 2;
        return state;
    },

    jumpToAddressV0: (state, opcode) => {
        state.i = opcode.nnn + state.registers[0x0];
        state.pc += 2;
        return state;
    },

    rnd: (state, opcode) => {
        state.registers = state.registers.slice(0);
        state.registers[opcode.vx] = Math.floor(Math.random() * (0x100)) & opcode.nn;
        state.pc += 2;
        return state;
    },

    draw: (state, opcode) => {
        state.gfx = state.gfx.slice(0);
        const x = state.registers[opcode.vx];
        const y = state.registers[opcode.vy];
        const bytes = opcode.n;
        let flip = false;

        for (let i = 0; i < bytes; i++) {
            const yPos = y + i;
            if (yPos >= 32) 
                break;

            const line = state.mem[state.i + i];
            const bits = line.toString(2)
                .padStart(8, '0')
                .split('')
                .map((v) => parseInt(v));

            for (let j = 0; j < bits.length; j++) {
                const xPos = x + j;
                if (xPos >= 64)
                    break;

                const index = (yPos * 64) + xPos;
                const newValue = state.gfx[index] ^ bits[j];
                if (state.gfx[index] == 1 && newValue == 0)
                    flip = true;

                state.gfx[index] = newValue;
            }
        }
        state.registers = state.registers.slice(0);
        state.registers[0xF] = flip ? 1 : 0;
        state.drawFlag = true;
        state.pc += 2;
        return state;
    },

    skipIfKeyPressed: (state, opcode) => {
        const vx = state.registers[opcode.vx];
        const isPressed = state.keys[vx];
        state.pc += isPressed ? 4 : 2;
        return state;
    },

    skipIfKeyNotPressed: (state, opcode) => {
        const vx = state.registers[opcode.vx];
        const isPressed = state.keys[vx];
        state.pc += isPressed ? 2 : 4;
        return state;
    },

    loadDtIntoVx: (state, opcode) => {
        state.registers = state.registers.slice(0);
        state.registers[opcode.vx] = state.delay & 0xFF;
        state.pc += 2;
        return state;
    },

    loadKeyIntoVx: (state, opcode) => {
        state.waitKeyRegister = opcode.vx;
        state.waitKeyFlag = true;
        return state;
    },

    loadVxIntoDt: (state, opcode) => {
        state.delay = state.registers[opcode.vx];
        state.pc += 2;
        return state;
    },

    loadVxIntoSt: (state, opcode) => {
        state.sound = state.registers[opcode.vx];
        state.pc += 2;
        return state;
    },

    addVxToI: (state, opcode) => {
        state.i += state.registers[opcode.vx];
        state.pc += 2;
        return state;
    },

    loadFontIntoI: (state, opcode) => {
        state.i = state.registers[opcode.vx] * 5;
        state.pc += 2;
        return state;
    },

    loadBcdIntoI: (state, opcode) => {
        const vx = state.registers[opcode.vx];
        const hundreds = Math.floor(vx / 100);
        const tens = Math.floor(vx / 10) % 10;
        const ones = vx % 10;
        state.mem = state.mem.slice(0);
        state.mem[state.i] = hundreds;
        state.mem[state.i + 1] = tens;
        state.mem[state.i + 2] = ones;
        state.pc += 2;
        return state;
    },

    loadV0VxIntoI: (state, opcode) => {
        const vx = opcode.vx;
        state.mem = state.mem.slice(0);
        for (let i = 0; i <= vx; i++) {
            const register = state.registers[i];
            state.mem[state.i + i] = register;
        }
        state.pc += 2;
        return state;
    },

    loadIIntoV0Vx: (state, opcode) => {
        const vx = opcode.vx;
        state.registers = state.registers.slice(0);
        for (let i = 0; i <= vx; i++) {
            const value = state.mem[state.i + i];
            state.registers[i] = value;
        }
        state.pc += 2;
        return state;
    }
};
