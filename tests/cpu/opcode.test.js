import Opcode from 'chip8/cpu/opcode.js'

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
