import Opcode from './opcode';


describe('Opcode', () => {
    test('x returns expected value', () => {
        const opcode = new Opcode(0x5432);

        expect(opcode.x).toBe(4);
    });

    test('y returns expected value', () => {
        const opcode = new Opcode(0x5432);

        expect(opcode.y).toBe(3);
    });

    test('nnn returns expected value', () => {
        const opcode = new Opcode(0x5432);

        expect(opcode.nnn).toBe(0x432);
    });

    test('nn returns expected value', () => {
        const opcode = new Opcode(0x5432);

        expect(opcode.nn).toBe(0x32);
    });

    test('n returns expected value', () => {
        const opcode = new Opcode(0x5432);

        expect(opcode.n).toBe(2);
    });
})