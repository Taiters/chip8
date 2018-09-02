import {opcode} from 'chip8/cpu/opcode.js';
import {execute, toString} from 'chip8/cpu/instructions';

test('Unexpected opcode throws', () => {
    expect(() => execute({
        pc: 0x200
    }, opcode(0x0123))).toThrow();
});

describe('execute', () => {
    describe('0x00E0: cls', () => {
        test('clears the gfx, sets clear flag and increments pc', () => {
            const expectedGfx = new Array(64 * 32);
            const state = {
                gfx: new Array(64 * 32),
                clearFlag: false,
                pc: 0x200,
            };

            state.gfx.fill(1);
            expectedGfx.fill(0);

            const result = execute(state, opcode(0x00E0));

            expect(result.gfx).toEqual(expectedGfx);
            expect(result.clearFlag).toBe(true);
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
});

describe('toString', () => {
    const expectString = (value) => expect(toString(opcode(value)));

    test('0x00E0: cls', () => expectString(0x00E0).toEqual('CLS'));
    test('0x00EE: ret', () => expectString(0x00EE).toEqual('RET'));
    test('0x1nnn: jp addr', () => expectString(0x1420).toEqual('JP 0x420'));
    test('0x2nnn: call addr', () => expectString(0x2001).toEqual('CALL 0x001'));
    test('0x3xnn: se vx, byte', () => expectString(0x3AFF).toEqual('SE VA, 255'));
    test('0x4xnn: sne vx, byte', () => expectString(0x430A).toEqual('SNE V3, 10'));
    test('0x5xy0: se vx, vy', () => expectString(0x53F0).toEqual('SE V3, VF'));
    test('0x6xnn: ld vx, byte', () => expectString(0x6712).toEqual('LD V7, 18'));
    test('0x7xnn: add vx, byte', () => expectString(0x7010).toEqual('ADD V0, 16'));
    test('0x8xy0: ld vx, vy', () => expectString(0x8F40).toEqual('LD VF, V4'));
    test('0x8xy1: or vx, vy', () => expectString(0x8F41).toEqual('OR VF, V4'));
    test('0x8xy2: and vx, vy', () => expectString(0x8F42).toEqual('AND VF, V4'));
    test('0x8xy3: xor vx, vy', () => expectString(0x8F43).toEqual('XOR VF, V4'));
    test('0x8xy4: add vx, vy', () => expectString(0x8F44).toEqual('ADD VF, V4'));
    test('0x8xy5: sub vx, vy', () => expectString(0x8F45).toEqual('SUB VF, V4'));
    test('0x8xy6: shr vx, vy', () => expectString(0x8F46).toEqual('SHR VF, V4'));
    test('0x8xy7: subn vx, vy', () => expectString(0x8F47).toEqual('SUBN VF, V4'));
    test('0x8xyE: shl vx, vy', () => expectString(0x8F4E).toEqual('SHL VF, V4'));
    test('0x9xy0: sne vx, vy', () => expectString(0x9F40).toEqual('SNE VF, V4'));
    test('0xAnnn: ld i, addr', () => expectString(0xAFAB).toEqual('LD I, 0xFAB'));
    test('0xBnnn: jp v0, addr', () => expectString(0xBFAB).toEqual('JP V0, 0xFAB'));
    test('0xCxnn: rnd vx, byte', () => expectString(0xCC04).toEqual('RND VC, 4'));
    test('0xDxyn: draw vx, vy, n', () => expectString(0xDC04).toEqual('DRAW VC, V0, 4'));
    test('0xEx9E: skp vx', () => expectString(0xE49E).toEqual('SKP V4'));
    test('0xExA1: sknp vx', () => expectString(0xE4A1).toEqual('SKNP V4'));
    test('0xFx07: ld vx, dt', () => expectString(0xFF07).toEqual('LD VF, DT'));
    test('0xFx0A: ld vx, K', () => expectString(0xFF0A).toEqual('LD VF, K'));
    test('0xFx15: ld dt, vx', () => expectString(0xFF15).toEqual('LD DT, VF'));
    test('0xFx18: ld st, vx', () => expectString(0xFF18).toEqual('LD ST, VF'));
    test('0xFx1E: add i, vx', () => expectString(0xFF1E).toEqual('ADD I, VF'));
    test('0xFx29: ld f, vx', () => expectString(0xFF29).toEqual('LD F, VF'));
    test('0xFx33: ld b, vx', () => expectString(0xFF33).toEqual('LD B, VF'));
    test('0xFx55: ld i, vx', () => expectString(0xFF55).toEqual('LD I, VF'));
    test('0xFx65: ld vx, i', () => expectString(0xFF65).toEqual('LD VF, I'));
});
