import {opcode} from 'chip8/cpu/opcode.js';
import execute from 'chip8/cpu/instructions.js';

test('Unexpected opcode throws', () => {
    expect(() => execute({
        pc: 0x200
    }, opcode(0x0123))).toThrow();
});

describe('0x00E0: cls', () => {
    test('clears the gfx, sets draw flag and increments pc', () => {
        const expectedGfx = new Array(64 * 32);
        const state = {
            gfx: new Array(64 * 32),
            drawFlag: false,
            pc: 0x200,
        };

        state.gfx.fill(1);
        expectedGfx.fill(0);

        const result = execute(state, opcode(0x00E0));

        expect(result.gfx).toEqual(expectedGfx);
        expect(result.drawFlag).toBe(true);
        expect(result.pc).toEqual(0x202);
    });
});

describe('0x00EE: ret', () => {
    test('sets the pc to the expected value', () => {
        const result = execute({
            stack: [0x205, 0x123, 0x420],
            pc: 0x500,
        }, opcode(0x00EE));

        expect(result.pc).toEqual(0x422);
    });

    test('throws exception if stack is empty', () => {
        expect(() => execute({
            stack: [],
            pc: 0x500,
        }, opcode(0x00EE))).toThrow();
    });
});

describe('0x1nnn: jp addr', () => {
    test('sets pc to expected value', () => {
        const result = execute({
            pc: 0x200,
        }, opcode(0x1428));

        expect(result.pc).toEqual(0x428);
    });
});

describe('0x2nnn: call addr', () => {
    test('places current addr on stack and updates pc', () => {
        const result = execute({
            stack: [0x420],
            pc: 0x512,
        }, opcode(0x2123));

        expect(result.pc).toEqual(0x123);
        expect(result.stack).toEqual([0x420, 0x512]);
    });
});

describe('0x3xnn: se vx, byte', () => {
    test('skips if vx == byte', () => {
        const result = execute({
            registers: [
                0x3, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ],
            pc: 0x200,
        }, opcode(0x3424));

        expect(result.pc).toEqual(0x204);
    });

    test('does not skip if vx != byte', () => {
        const result = execute({
            registers: [
                0x3, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ],
            pc: 0x200,
        }, opcode(0x3124));

        expect(result.pc).toEqual(0x202);
    });
});

describe('0x4xnn: sne vx, byte', () => {
    test('does not skip if vx == byte', () => {
        const result = execute({
            registers: [
                0x3, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ],
            pc: 0x200,
        }, opcode(0x4424));

        expect(result.pc).toEqual(0x202);
    });

    test('skips if vx does != byte', () => {
        const result = execute({
            registers: [
                0x3, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ],
            pc: 0x200,
        }, opcode(0x4124));

        expect(result.pc).toEqual(0x204);
    });
});

describe('0x5xy0: se vx, vy', () => {
    test('skips if vx == vy', () => {
        const result = execute({
            registers: [
                0x3, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ],
            pc: 0x200,
        }, opcode(0x5230));

        expect(result.pc).toEqual(0x204);
    });

    test('does not skip if vx != vy', () => {
        const result = execute({
            registers: [
                0x3, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ],
            pc: 0x200,
        }, opcode(0x5210));

        expect(result.pc).toEqual(0x202);
    });
});

