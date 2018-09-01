const cls = (state) => {
    state.gfx.fill(0);
    state.drawFlag = true;
    state.pc += 2;
    return state;
};

const ret = (state, opcode) => {
    if (state.stack.length == 0)
        throw 'Stack is empty';

    state.pc = state.stack.pop() + 2;
    return state;
};

const jumpToAddress = (state, opcode) => {
    state.pc = opcode.nnn;
    return state;
};

const callAddress = (state, opcode) => {
    state.stack.push(state.pc);
    state.pc = opcode.nnn;
    return state;
};

const skipIfVxEqByte = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    state.pc += vx == opcode.nn ? 4 : 2;
    return state;
};

const skipIfVxNotEqByte = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    state.pc += vx != opcode.nn ? 4 : 2;
    return state;
};

const skipIfVxEqVy = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    state.pc += vx == vy ? 4 : 2;
    return state;
};

const loadByteIntoVx = (state, opcode) => {
    state.registers[opcode.vx] = opcode.nn;
    state.pc += 2;
    return state;
};

const addByteToVx = (state, opcode) => {
    const newValue = state.registers[opcode.vx] + opcode.nn;
    state.registers[opcode.vx] = newValue & 0xFF;
    state.pc += 2;
    return state;
};

const loadVyIntoVx = (state, opcode) => {
    state.registers[opcode.vx] = state.registers[opcode.vy];
    state.pc += 2;
    return state;
};

const or = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    state.registers[opcode.vx] = (vx | vy) & 0xFF;
    state.pc += 2;
    return state;
};

const and = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    state.registers[opcode.vx] = (vx & vy) & 0xFF;
    state.pc += 2;
    return state;
};

const xor = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    state.registers[opcode.vx] = (vx ^ vy) & 0xFF;
    state.pc += 2;
    return state;
};

const addVyToVx = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    const newValue = vx + vy;
    state.registers[0x0F] = newValue > 0xFF ? 1 : 0;
    state.registers[opcode.vx] = newValue & 0xFF;
    state.pc += 2;
    return state;
};

const subVyFromVx = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    const newValue = vx - vy;
    state.registers[0x0F] = newValue < 0 ? 0 : 1;
    state.registers[opcode.vx] = newValue & 0xFF;
    state.pc += 2;
    return state;
};

const shr = (state, opcode) => {
    const vy = state.registers[opcode.vy];
    const leastSignificantBit = vy & 0x01;
    state.registers[0x0F] = leastSignificantBit;
    state.registers[opcode.vx] = vy >> 1;
    state.pc += 2;
    return state;
};

const subVxFromVy = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    const newValue = vy - vx;
    state.registers[0x0F] = newValue < 0 ? 0 : 1;
    state.registers[opcode.vx] = newValue & 0xFF;
    state.pc += 2;
    return state;
};

const shl = (state, opcode) => {
    const vy = state.registers[opcode.vy];
    const mostSignificantBit = (vy & 0x8000) >> 15;
    state.registers[0x0F] = mostSignificantBit;
    state.registers[opcode.vx] = (vy << 1) & 0xFF;
    state.pc += 2;
    return state;
};

const skipIfVxNotEqVy = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const vy = state.registers[opcode.vy];
    state.pc += vx != vy ? 4 : 2;
    return state;
};

const loadAddressIntoI = (state, opcode) => {
    state.i = opcode.nnn;
    state.pc += 2;
    return state;
};

const jumpToAddressV0 = (state, opcode) => {
    state.i = opcode.nnn + state.registers[0x0];
    state.pc += 2;
    return state;
};

const rnd = (state, opcode) => {
    state.registers[opcode.vx] = Math.floor(Math.random() * (0x100)) & opcode.nn;
    state.pc += 2;
    return state;
};

const draw = (state, opcode) => {
    const x = state.registers[opcode.vx];
    const y = state.registers[opcode.vy];
    const bytes = opcode.n;
    let flip = false;

    for (let i = 0; i < bytes; i++) {
        const yPos = y + i;
        if (yPos >= 32) 
            return state;

        const line = state.mem[state.i + i];
        const bits = line.toString(2)
            .padStart(8, '0')
            .split('')
            .map((v) => parseInt(v));

        for (let j = 0; j < bits.length; j++) {
            const xPos = x + j;
            if (xPos >= 64)
                return state;

            const index = (yPos * 64) + xPos;
            const newValue = state.gfx[index] ^ bits[j];
            if (state.gfx[index] == 1 && newValue == 0)
                flip = true;

            state.gfx[index] = newValue;
            if(newValue == 1)
                state.drawFlag = true;
        }
    }
    state.registers[0xF] = flip ? 1 : 0;
    state.pc += 2;
    return state;
};

const skipIfKeyPressed = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const isPressed = state.keyboard.isPressed(vx);
    state.pc += isPressed ? 4 : 2;
    return state;
};

const skipIfKeyNotPressed = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const isPressed = state.keyboard.isPressed(vx);
    state.pc += isPressed ? 2 : 4;
    return state;
};

const loadDtIntoVx = (state, opcode) => {
    state.registers[opcode.vx] = state.delay & 0xFF;
    state.pc += 2;
    return state;
};

const loadKeyIntoVx = (state, opcode) => {
    state.waitingForRegister = opcode.vx;
    state.isWaitingForKey = true;
    return state;
};

const loadVxIntoDt = (state, opcode) => {
    state.delay = state.registers[opcode.vx];
    state.pc += 2;
    return state;
};

const loadVxIntoSt = (state, opcode) => {
    state.sound = state.registers[opcode.vx];
    state.pc += 2;
    return state;
};

const addVxToI = (state, opcode) => {
    state.i += state.registers[opcode.vx];
    state.pc += 2;
    return state;
};

const loadFontIntoI = (state, opcode) => {
    state.i = state.registers[opcode.vx] * 5;
    state.pc += 2;
    return state;
};

const loadBcdIntoI = (state, opcode) => {
    const vx = state.registers[opcode.vx];
    const hundreds = Math.floor(vx / 100);
    const tens = Math.floor(vx / 10) % 10;
    const ones = vx % 10;
    state.mem[state.i] = hundreds;
    state.mem[state.i + 1] = tens;
    state.mem[state.i + 2] = ones;
    state.pc += 2;
    return state;
};

const loadV0VxIntoI = (state, opcode) => {
    const vx = opcode.vx;
    for (let i = 0; i <= vx; i++) {
        const register = state.registers[i];
        state.mem[state.i + i] = register;
    }
    state.pc += 2;
    return state;
};

const loadIIntoV0Vx = (state, opcode) => {
    const vx = opcode.vx;
    for (let i = 0; i <= vx; i++) {
        const value = state.mem[state.i + i];
        state.registers[i] = value;
    }
    state.pc += 2;
    return state;
};

const instr = (value, mask, instruction) => ({
    check: (opcode) => opcode.equals(value, mask),
    instruction
});

const instructions = [
    // 00E0: CLS
    instr(0x00E0, 0xFFFF, cls),
    // 00EE: RET
    instr(0x00EE, 0xFFFF, ret),
    // 1nnn: JP addr
    instr(0x1000, 0xF000, jumpToAddress),
    // 2nnn: CALL addr
    instr(0x2000, 0xF000, callAddress),
    // 3xnn: SE Vx, byte
    instr(0x3000, 0xF000, skipIfVxEqByte),
    // 4xnn: SNE Vx, byte
    instr(0x4000, 0xF000, skipIfVxNotEqByte),
    // 5xy0: SE Vx, Vy
    instr(0x5000, 0xF000, skipIfVxEqVy),
    // 6xnn: LD Vx, byte
    instr(0x6000, 0xF000, loadByteIntoVx),
    // 7xnn: ADD Vx, byte
    instr(0x7000, 0xF000, addByteToVx),
    // 8xy0: LD Vx, Vy
    instr(0x8000, 0xF00F, loadVyIntoVx),
    // 8xy1: OR Vx, Vy
    instr(0x8001, 0xF00F, or),
    // 8xy2: AND Vx, Vy
    instr(0x8002, 0xF00F, and),
    // 8xy3: XOR Vx, Vy
    instr(0x8003, 0xF00F, xor),
    // 8xy4: ADD Vx, Vy
    instr(0x8004, 0xF00F, addVyToVx),
    // 8xy5: SUB Vx, Vy
    instr(0x8005, 0xF00F, subVyFromVx),
    // 8xy6: SHR Vx, Vy
    instr(0x8006, 0xF00F, shr),
    // 8xy7: SUBN Vx, Vy
    instr(0x8007, 0xF00F, subVxFromVy),
    // 8xyE: SHL Vx, Vy
    instr(0x800E, 0xF00F, shl),
    // 9xy0: SNE Vx, Vy
    instr(0x9000, 0xF00F, skipIfVxNotEqVy),
    // Annn: LD I, addr
    instr(0xA000, 0xF000, loadAddressIntoI),
    // Bnnn: JP V0, addr
    instr(0xB000, 0xF000, jumpToAddressV0),
    // Cxnn: RND Vx, byte
    instr(0xC000, 0xF000, rnd),
    // Dxyn: DRAW Vx, Vy, n
    instr(0xD000, 0xF000, draw),
    // Ex9E: SKP Vx
    instr(0xE09E, 0xF0FF, skipIfKeyPressed),
    // ExA1: SKNP Vx
    instr(0xE0A1, 0xF0FF, skipIfKeyNotPressed),
    // Fx07: LD Vx, DT
    instr(0xF007, 0xF0FF, loadDtIntoVx),
    // Fx0A: LD Vx, K
    instr(0xF00A, 0xF0FF, loadKeyIntoVx),
    // Fx15: LD DT, Vx
    instr(0xF015, 0xF0FF, loadVxIntoDt),
    // Fx18: LD ST, Vx
    instr(0xF018, 0xF0FF, loadVxIntoSt),
    // Fx1E: ADD I, Vx
    instr(0xF01E, 0xF0FF, addVxToI),
    // Fx29: LD F, Vx
    instr(0xF029, 0xF0FF, loadFontIntoI),
    // Fx33: LD B, Vx
    instr(0xF033, 0xF0FF, loadBcdIntoI),
    // Fx55: LD I, Vx
    instr(0xF055, 0xF0FF, loadV0VxIntoI),
    // Fx65: LD Vx, I
    instr(0xF065, 0xF0FF, loadIIntoV0Vx),
];

const getInstruction = (opcode) => {
    const result = instructions.find(i => i.check(opcode));
    if (result == undefined)
        throw 'Unexpected opcode ' + opcode;

    return result.instruction;
};

const execute = (state, opcode) => getInstruction(opcode)(state, opcode);

export default execute;
