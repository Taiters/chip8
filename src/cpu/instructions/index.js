import Handlebars from 'handlebars';
import ops from './operations.js';

const instructionToString = (opcode, template) => {
    return template({
        vx: 'V'+opcode.vx.toString(16).toUpperCase(),
        vy: 'V'+opcode.vy.toString(16).toUpperCase(),
        b: opcode.nn,
        n: opcode.n,
        addr: '0x'+opcode.nnn.toString(16).toUpperCase().padStart(3, '0'),
    });
};

const instruction = (value, mask, operation, strTemplate) => {
    const template = Handlebars.compile(strTemplate);
    return {
        check: (opcode) => opcode.equals(value, mask),
        toString: (opcode) => instructionToString(opcode, template),
        execute: operation,
    };
};

const instructions = [
    // 00E0: CLS
    instruction(0x00E0, 0xFFFF, ops.cls, 'CLS'),
    // 00EE: RET
    instruction(0x00EE, 0xFFFF, ops.ret, 'RET'),
    // 1nnn: JP addr
    instruction(0x1000, 0xF000, ops.jumpToAddress, 'JP {{addr}}'),
    // 2nnn: CALL addr
    instruction(0x2000, 0xF000, ops.callAddress, 'CALL {{addr}}'),
    // 3xnn: SE Vx, byte
    instruction(0x3000, 0xF000, ops.skipIfVxEqByte, 'SE {{vx}}, {{b}}'),
    // 4xnn: SNE Vx, byte
    instruction(0x4000, 0xF000, ops.skipIfVxNotEqByte, 'SNE {{vx}}, {{b}}'),
    // 5xy0: SE Vx, Vy
    instruction(0x5000, 0xF000, ops.skipIfVxEqVy, 'SE {{vx}}, {{vy}}'),
    // 6xnn: LD Vx, byte
    instruction(0x6000, 0xF000, ops.loadByteIntoVx, 'LD {{vx}}, {{b}}'),
    // 7xnn: ADD Vx, byte
    instruction(0x7000, 0xF000, ops.addByteToVx, 'ADD {{vx}}, {{b}}'),
    // 8xy0: LD Vx, Vy
    instruction(0x8000, 0xF00F, ops.loadVyIntoVx, 'LD {{vx}}, {{vy}}'),
    // 8xy1: OR Vx, Vy
    instruction(0x8001, 0xF00F, ops.or, 'OR {{vx}}, {{vy}}'),
    // 8xy2: AND Vx, Vy
    instruction(0x8002, 0xF00F, ops.and, 'AND {{vx}}, {{vy}}'),
    // 8xy3: XOR Vx, Vy
    instruction(0x8003, 0xF00F, ops.xor, 'XOR {{vx}}, {{vy}}'),
    // 8xy4: ADD Vx, Vy
    instruction(0x8004, 0xF00F, ops.addVyToVx, 'ADD {{vx}}, {{vy}}'),
    // 8xy5: SUB Vx, Vy
    instruction(0x8005, 0xF00F, ops.subVyFromVx, 'SUB {{vx}}, {{vy}}'),
    // 8xy6: SHR Vx, Vy
    instruction(0x8006, 0xF00F, ops.shr, 'SHR {{vx}}, {{vy}}'),
    // 8xy7: SUBN Vx, Vy
    instruction(0x8007, 0xF00F, ops.subVxFromVy, 'SUBN {{vx}}, {{vy}}'),
    // 8xyE: SHL Vx, Vy
    instruction(0x800E, 0xF00F, ops.shl, 'SHL {{vx}}, {{vy}}'),
    // 9xy0: SNE Vx, Vy
    instruction(0x9000, 0xF00F, ops.skipIfVxNotEqVy, 'SNE {{vx}}, {{vy}}'),
    // Annn: LD I, addr
    instruction(0xA000, 0xF000, ops.loadAddressIntoI, 'LD I, {{addr}}'),
    // Bnnn: JP V0, addr
    instruction(0xB000, 0xF000, ops.jumpToAddressV0, 'JP V0, {{addr}}'),
    // Cxnn: RND Vx, byte
    instruction(0xC000, 0xF000, ops.rnd, 'RND {{vx}}, {{b}}'),
    // Dxyn: DRAW Vx, Vy, n
    instruction(0xD000, 0xF000, ops.draw, 'DRAW {{vx}}, {{vy}}, {{n}}'),
    // Ex9E: SKP Vx
    instruction(0xE09E, 0xF0FF, ops.skipIfKeyPressed, 'SKP {{vx}}'),
    // ExA1: SKNP Vx
    instruction(0xE0A1, 0xF0FF, ops.skipIfKeyNotPressed, 'SKNP {{vx}}'),
    // Fx07: LD Vx, DT
    instruction(0xF007, 0xF0FF, ops.loadDtIntoVx, 'LD {{vx}}, DT'),
    // Fx0A: LD Vx, K
    instruction(0xF00A, 0xF0FF, ops.loadKeyIntoVx, 'LD {{vx}}, K'),
    // Fx15: LD DT, Vx
    instruction(0xF015, 0xF0FF, ops.loadVxIntoDt, 'LD DT, {{vx}}'),
    // Fx18: LD ST, Vx
    instruction(0xF018, 0xF0FF, ops.loadVxIntoSt, 'LD ST, {{vx}}'),
    // Fx1E: ADD I, Vx
    instruction(0xF01E, 0xF0FF, ops.addVxToI, 'ADD I, {{vx}}'),
    // Fx29: LD F, Vx
    instruction(0xF029, 0xF0FF, ops.loadFontIntoI, 'LD F, {{vx}}'),
    // Fx33: LD B, Vx
    instruction(0xF033, 0xF0FF, ops.loadBcdIntoI, 'LD B, {{vx}}'),
    // Fx55: LD I, Vx
    instruction(0xF055, 0xF0FF, ops.loadV0VxIntoI, 'LD I, {{vx}}'),
    // Fx65: LD Vx, I
    instruction(0xF065, 0xF0FF, ops.loadIIntoV0Vx, 'LD {{vx}}, I'),
];

const getInstruction = (opcode) => {
    const result = instructions.find(i => i.check(opcode));
    if (result == undefined)
        throw 'Unexpected opcode ' + opcode;

    return result;
};

const execute = (state, opcode) => getInstruction(opcode).execute(state, opcode);
const toString = (opcode) => getInstruction(opcode).toString(opcode);

export {getInstruction, execute, toString};
