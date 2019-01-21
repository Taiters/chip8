import Opcode from 'chip8/app/models/opcode.js'

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

test('equals returns true if opcodes match', () => {
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
