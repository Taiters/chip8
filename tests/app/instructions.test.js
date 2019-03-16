import { createOpcode } from 'chip8/app/opcode.js';
import { execute, toString } from 'chip8/app/instructions';


test('Unexpected opcode throws', () => {
    expect(() => execute({
        pc: 0x200
    }, createOpcode(0x0123))).toThrow();
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

            const result = execute(state, createOpcode(0x00E0));

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
            }, createOpcode(0x00EE));

            expect(result.pc).toEqual(0x422);
        });

        test('throws exception if stack is empty', () => {
            expect(() => execute({
                stack: [],
                pc: 0x500,
            }, createOpcode(0x00EE))).toThrow();
        });
    });

    describe('0x1nnn: jp addr', () => {
        test('sets pc to expected value', () => {
            const result = execute({
                pc: 0x200,
            }, createOpcode(0x1428));

            expect(result.pc).toEqual(0x428);
        });
    });

    describe('0x2nnn: call addr', () => {
        test('places current addr on stack and updates pc', () => {
            const result = execute({
                stack: [0x420],
                pc: 0x512,
            }, createOpcode(0x2123));

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
            }, createOpcode(0x3424));

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
            }, createOpcode(0x3124));

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
            }, createOpcode(0x4424));

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
            }, createOpcode(0x4124));

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
            }, createOpcode(0x5230));

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
            }, createOpcode(0x5210));

            expect(result.pc).toEqual(0x202);
        });
    });

    describe('0x6xnn: ld vx, byte', () => {
        test('loads byte value into vx', () => {
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
            }, createOpcode(0x6023));

            expect(result.registers).toEqual([
                0x23, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ]);

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x7xnn: add vx, byte', () => {
        test('adds byte into vx', () => {
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
            }, createOpcode(0x70ff));

            expect(result.registers).toEqual([
                0x2, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ]);

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy0: ld vx, vy', () => {
        test('loads value of vy into vx', () => {
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
            }, createOpcode(0x8020));

            expect(result.registers).toEqual([
                0x8, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ]);

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy1: or vx, vy', () => {
        test('loads result of bitwise ORing of vx and vy into vx', () => {
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
            }, createOpcode(0x8021));

            expect(result.registers).toEqual([
                0xb, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ]);

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy2: and vx, vy', () => {
        test('loads result of bitwise ANDing of vx and vy into vx', () => {
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
            }, createOpcode(0x8022));

            expect(result.registers).toEqual([
                0x0, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ]);

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy3: xor vx, vy', () => {
        test('loads result of bitwise XORing of vx and vy into vx', () => {
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
            }, createOpcode(0x8023));

            expect(result.registers).toEqual([
                0xB, 
                0x1, 
                0x8, 
                0x8, 
                0x24, 
                0x12
            ]);

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy4: add vx, vy', () => {
        test('sets vf to 1 if a carry occurs', () => {

            let registers = Array(16).fill(0);

            registers[0] = 241;
            registers[2] = 15;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x8024));

            expect(result.registers[0]).toEqual(0);
            expect(result.registers[2]).toEqual(15);
            expect(result.registers[15]).toEqual(1);
            expect(result.pc).toEqual(0x202);
        });

        test('sets vf to 0 if a carry does not occur', () => {

            let registers = Array(16).fill(0);

            registers[0] = 240;
            registers[2] = 15;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x8024));

            expect(result.registers[0]).toEqual(255);
            expect(result.registers[2]).toEqual(15);
            expect(result.registers[15]).toEqual(0);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy5: sub vx, vy', () => {
        test('Sets vf to 0 if a borrow occurs', () => {

            let registers = Array(16).fill(0);

            registers[0] = 0;
            registers[2] = 1;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x8025));

            expect(result.registers[0]).toEqual(255);
            expect(result.registers[2]).toEqual(1);
            expect(result.registers[15]).toEqual(0);
            expect(result.pc).toEqual(0x202);
        });

        test('Sets vf to 1 if a borrow does not occur', () => {

            let registers = Array(16).fill(0);

            registers[0x00] = 0x0F;
            registers[0x02] = 0x0F;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x8025));

            expect(result.registers[0x00]).toEqual(0x00);
            expect(result.registers[0x02]).toEqual(0x0F);
            expect(result.registers[0x0F]).toEqual(0x01);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy6: shr vx, vy', () => {
        test('stores the value of vy shifted right one bit in vx and sets vf to the least significant bit prior to the shift', () => {

            let registers = Array(16).fill(0);

            registers[2] = 3;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x8026));

            expect(result.registers[0]).toEqual(1);
            expect(result.registers[2]).toEqual(3);
            expect(result.registers[15]).toEqual(1);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xy7: subn vx, vy', () => {
        test('sets vx to the value of vy - vx and sets vf to 0 if a borrow occurs', () => {

            let registers = Array(16).fill(0);

            registers[0] = 1;
            registers[2] = 0;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x8027));

            expect(result.registers[0]).toEqual(0xFF);
            expect(result.registers[2]).toEqual(0);
            expect(result.registers[15]).toEqual(0);
            expect(result.pc).toEqual(0x202);
        });

        test('sets vx to the value of vy - vx and sets vf to 0 if a borrow dose not occur', () => {

            let registers = Array(16).fill(0);

            registers[0] = 15;
            registers[2] = 15;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x8027));

            expect(result.registers[0]).toEqual(0);
            expect(result.registers[2]).toEqual(15);
            expect(result.registers[15]).toEqual(1);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x8xye: shl vx, vy', () => {
        test('stores the value of vy shifted left one bit in vx and sets vf to the most significant bit prior to the shift', () => {

            let registers = Array(16).fill(0);

            registers[2] = 0xF0;

            const result = execute({
                registers: registers,
                pc: 0x200,
            }, createOpcode(0x802E));

            expect(result.registers[0]).toEqual(224);
            expect(result.registers[2]).toEqual(240);
            expect(result.registers[15]).toEqual(1);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0x9xy0: sne vx, vy', () => {
        test('skips if vx != vy', () => {
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
            }, createOpcode(0x9210));

            expect(result.pc).toEqual(0x204);
        });

        test('dose not skip if vx == vy', () => {
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
            }, createOpcode(0x9230));

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xAnnn: ld i, addr', () => {
        test('stores addr in register i', () => {
            const result = execute({
                i: 0,
                pc: 0x200,
            }, createOpcode(0xA2EF));

            expect(result.i).toEqual(0x2EF);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xBnnn: jp v0, addr', () => {
        test('sets pc to (V0 + addr)', () => {
            const result = execute({
               
                registers: [0x0F],
                pc: 0x200,
            }, createOpcode(0xB400));

            expect(result.pc).toEqual(0x40F);
        });
    });

    describe('0xCxnn: rnd vx, byte', () => {
        test('sets vx to a random number with a mask of byte', () => {

            const globalMath = Object.create(global.Math);
            const mockMath = Object.create(global.Math);
            mockMath.random = () => {
                let rnd = 0.4;
                return rnd;
            };
            global.Math = mockMath;

            const result = execute({
                registers: [15],
                pc: 0x200,
            }, createOpcode(0xC0F0));

            global.Math = globalMath;

            expect(result.registers[0]).toEqual(96);
            expect(result.pc).toEqual(0x202);
        });
    });

    describe('0xDxyn: draw vx, vy, n', () => {
        test('sets vf to 1 if any set pixels are changed', () => {

            let expectedGfx =
                Array.from(new Array(32),
                    () => Array.from(new Array(8),
                        () => Array.from(new Array(8),
                            () => 1))).map(
                    (_, index, array) => {
                        if (index < 15) {
                            (array[index][1]) = Array.from(new Array(8), () => 0);
                        }
                        return array[index];
                    });

            const flatten = array => {
                while (array.find(element => Array.isArray(element))) array = Array.prototype.concat(...array);
                return array;
            };

            expectedGfx = flatten(expectedGfx);

            const state = {
                registers: [
                    8,
                    0
                ],
                i: 0,
                gfx: new Array(64 * 32),
                mem: new Array(8 * 32),
                drawFlag: false,
                pc: 0x200,
            };
            state.gfx.fill(1);
            state.mem.fill(255);
            

            const result = execute(state, createOpcode(0xD01F));

            expect(result.gfx).toEqual(expectedGfx);
            expect(result.drawFlag).toBe(true);
            expect(result.registers[0]).toEqual(8);
            expect(result.registers[1]).toEqual(0);
            expect(result.registers[15]).toEqual(1);
            expect(result.pc).toEqual(0x202);
        });

        test('does not set vf to 1 if any set pixels are not changed', () => {

            let expectedGfx =
                Array.from(new Array(32),
                    () => Array.from(new Array(8),
                        () => Array.from(new Array(8),
                            () => 1)));

            const flatten = array => {
                while (array.find(element => Array.isArray(element))) array = Array.prototype.concat(...array);
                return array;
            };

            expectedGfx = flatten(expectedGfx);

            const state = {
                registers: [
                    8,
                    0
                ],
                i: 0,
                gfx: new Array(64 * 32),
                mem: new Array(8 * 32),
                drawFlag: false,
                pc: 0x200,
            };
            state.gfx.fill(1);
            state.mem.fill(0);
            

            const result = execute(state, createOpcode(0xD01F));

            expect(result.gfx).toEqual(expectedGfx);
            expect(result.drawFlag).toBe(true);
            expect(result.registers[0]).toEqual(8);
            expect(result.registers[1]).toEqual(0);
            expect(result.registers[15]).toEqual(0);
            expect(result.pc).toEqual(0x202);
        });
    });

    describe('0xEx9E: skp vx', () => {
        test('skips if keys[vx] is pressed', () => {
            const result = execute({
                registers: [0],
                keys: [1],
                pc: 0x200,
            }, createOpcode(0xE09E));


            expect(result.registers[0]).toEqual(0);
            expect(result.pc).toEqual(0x204);
        });

        test('dose not skip if keys[vx] is not pressed', () => {
            const result = execute({
                registers: [0],
                keys: [0],
                pc: 0x200,
            }, createOpcode(0xE09E));


            expect(result.registers[0]).toEqual(0);
            expect(result.pc).toEqual(0x202);
        });
    });

    describe('0xExA1: sknp vx', () => {
        test('skips if keys[vx] is not pressed', () => {
            const result = execute({
                registers: [0],
                keys: [0],
                pc: 0x200,
            }, createOpcode(0xE0A1));


            expect(result.registers[0]).toEqual(0);
            expect(result.pc).toEqual(0x204);
        });

        test('dose not skip if keys[vx] is pressed', () => {
            const result = execute({
                registers: [0],
                keys: [1],
                pc: 0x200,
            }, createOpcode(0xE0A1));


            expect(result.registers[0]).toEqual(0);
            expect(result.pc).toEqual(0x202);
        });
    });

    describe('0xFx07: ld vx, dt', () => {
        test('loads value of dt into vx', () => {
            const result = execute({
                delay: 0x10,
                registers: [
                    0x3, 
                    0x1, 
                    0x8, 
                    0x8, 
                    0x24, 
                    0x12
                ],
                pc: 0x200,
            }, createOpcode(0xF207));

            expect(result.registers).toEqual([
                0x3, 
                0x1, 
                0x10, 
                0x8, 
                0x24, 
                0x12
            ]);

            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xFx0A: ld vx, K', () => {
        test('Waits for keypress and loads result in vx', () => {
            const result = execute({
                waitKeyRegister: 2,
                waitKeyFlag: false,
                pc: 0x200,
            }, createOpcode(0xF10A));

            expect(result.waitKeyRegister).toEqual(1);
            expect(result.waitKeyFlag).toEqual(true);
            expect(result.pc).toEqual(0x200);
        });

    });

    describe('0xFx15: ld dt, vx', () => {
        test('sets value of vx to dt', () => {
            const result = execute({
                delay: 0x10,
                registers: [
                    0x3, 
                    0x1, 
                ],
                pc: 0x200,
            }, createOpcode(0xF015));

            expect(result.delay).toEqual(0x3);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xFx18: ld st, vx', () => {
        test('sets value of vx to st', () => {
            const result = execute({
                sound: 16,
                registers: [
                    3, 
                    1, 
                ],
                pc: 0x200,
            }, createOpcode(0xF018));

            expect(result.sound).toEqual(3);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xFx1E: add i, vx', () => {
        test('adds value of vx to i register', () => {
            const result = execute({
                i:0x400,
                registers: [
                    3, 
                    1, 
                ],
                pc: 0x200,
            }, createOpcode(0xF01E));

            expect(result.i).toEqual(0x403);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xFx29: ld f, vx', () => {
        test('loads address of font f in i register base on vx value', () => {
            const result = execute({
                i:0x400,
                registers: [
                    0x50, 
                    0x1, 
                ],
                pc: 0x200,
            }, createOpcode(0xF029));

            expect(result.i).toEqual(0x190);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xFx33: ld b, vx', () => {
        test('stores BCD representation of vx in memory addresses referenced by i, i+1 and i+2', () => {
            const result = execute({
                i:0,
                mem: [
                    0,
                    0,
                    0 
                ],
                registers: [
                    256, 
                    1, 
                ],
                pc: 0x200,
            }, createOpcode(0xF033));

            expect(result.mem).toEqual([2, 5, 6]);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xFx55: ld i, vx', () => {
        test('stores values of v0-vx in memory from i to i+x and sets i to i+x+1', () => {
            
            const regs = Array.from(Array(16).keys());
            const mem = Array.from(Array(16), () => 0);

            const result = execute({
                i:0,
                mem: mem,
                registers: regs,
                pc: 0x200,
            }, createOpcode(0xFF55));

            expect(result.i).toEqual(16);
            expect(result.mem).toEqual(regs);
            expect(result.pc).toEqual(0x202);
        });

    });

    describe('0xFx65: ld vx, i', () => {
        test('fills registers v0-vx with values in memory from i to i+x and sets i to i+x+1', () => {
            
            const regs = Array.from(Array(16), () => 0);
            const mem = Array.from(Array(16).keys());

            const result = execute({
                i:0,
                mem: mem,
                registers: regs,
                pc: 0x200,
            }, createOpcode(0xFF65));

            expect(result.i).toEqual(16);
            expect(result.registers).toEqual(mem);
            expect(result.pc).toEqual(0x202);
        });

    });




});

describe('toString', () => {
    const expectString = (value) => expect(toString(createOpcode(value)));

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
