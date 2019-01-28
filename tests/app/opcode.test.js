import { Opcode, OpcodeFactory } from 'chip8/app/opcode.js';


describe('Opcode', () => {
    test('get i returns expected values', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)

        const results = [
            opcode.get(0),
            opcode.get(1),
            opcode.get(2),
            opcode.get(3),
        ];

        expect(results).toEqual([15, 10, 11, 12]);
    });

    test('equals returns true if opcodes match', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)

        expect(opcode.equals(0xFABC)).toBe(true);
    });

    test('equals returns false if opcodes do not match', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)

        expect(opcode.equals(0xFABD)).toBe(false);
    });

    test('returns expected i', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)
        
        expect(opcode.i).toBe(15);
    });

    test('returns expected vx', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)
        
        expect(opcode.vx).toBe(10);
    });

    test('returns expected vy', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)
        
        expect(opcode.vy).toBe(11);
    });

    test('returns expected nnn', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)
        
        expect(opcode.nnn).toBe(2748);
    });

    test('returns expected nn', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)
        
        expect(opcode.nn).toBe(188);
    });

    test('returns expected n', () => {
        // Hex: FABC
        const opcode = new Opcode(64188)
        
        expect(opcode.n).toBe(12);
    });
});

describe('OpcodeFactory', () => {
    test('returns expected opcode with single value', () => {
        const factory = new OpcodeFactory()

        // Hex: FABC
        const opcode = factory.create(64188);

        expect(opcode.equals(0xFABC)).toBe(true);
    });

    test('returns expected opcode with two values', () => {
        const factory = new OpcodeFactory()

        // Hex: FABC
        const opcode = factory.create(250, 188);

        expect(opcode.equals(0xFABC)).toBe(true);
    });
});