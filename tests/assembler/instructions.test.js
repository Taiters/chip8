import getOpcode from 'chip8/assembler/instructions.js';

describe('ret', () => {
    test('returns expected opcode', () => {
        const result = getOpcode({
            operation: 'ret',
            args: []
        });

        expect(result).toEqual(0x00EE);
    });
});

describe('call', () => {
    test('returns expected opcode', () => {
        const result = getOpcode({
            operation: 'call',
            args: [{
                type: 'address',
                value: 0x5F3
            }]
        });

        expect(result).toEqual(0x25F3);
    });
});

describe('jp', () => {
    test('returns expected opcode', () => {
        const result = getOpcode({
            operation: 'jp',
            args: [{
                type: 'address',
                value: 0xABC
            }]
        });

        expect(result).toEqual(0x1ABC);
    });
});

describe('ld', () => {
    test('ld vx, b', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'register',
                    value: 10
                },
                {
                    type: 'number',
                    value: 17
                }
            ]
        });

        expect(result).toEqual(0x6A11);
    });

    test('ld vx, vy', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'register',
                    value: 15
                },
                {
                    type: 'register',
                    value: 7
                }
            ]
        });

        expect(result).toEqual(0x8F71);
    });

    test('ld I, addr', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'identifier',
                    value: 'I'
                },
                {
                    type: 'address',
                    value: 0xDED
                }
            ]
        });

        expect(result).toEqual(0xADED);
    });

    test('ld vx, DT', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'register',
                    value: 4
                },
                {
                    type: 'identifier',
                    value: 'DT'
                }
            ]
        });

        expect(result).toEqual(0xF407);
    });

    test('ld vx, K', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'register',
                    value: 5
                },
                {
                    type: 'identifier',
                    value: 'K'
                }
            ]
        });

        expect(result).toEqual(0xF50A);
    });

    test('ld DT, vx', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'identifier',
                    value: 'DT'
                },
                {
                    type: 'register',
                    value: 10
                }
            ]
        });

        expect(result).toEqual(0xFA15);
    });

    test('ld ST, vx', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'identifier',
                    value: 'ST'
                },
                {
                    type: 'register',
                    value: 11
                }
            ]
        });

        expect(result).toEqual(0xFB18);
    });

    test('ld F, vx', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'identifier',
                    value: 'F'
                },
                {
                    type: 'register',
                    value: 12
                }
            ]
        });

        expect(result).toEqual(0xFC29);
    });

    test('ld B, vx', () => {
        const result = getOpcode({
            operation: 'ld',
            args: [
                {
                    type: 'identifier',
                    value: 'B'
                },
                {
                    type: 'register',
                    value: 13
                }
            ]
        });

        expect(result).toEqual(0xFD33);
    });
});

describe('se', () => {
    test('se vx, b', () => {
        const result = getOpcode({
            operation: 'se',
            args: [
                {
                    type: 'register',
                    value: 12
                },
                {
                    type: 'number',
                    value: 20
                }
            ]
        });

        expect(result).toEqual(0x3C14);
    });

    test('se vx, b', () => {
        const result = getOpcode({
            operation: 'se',
            args: [
                {
                    type: 'register',
                    value: 12
                },
                {
                    type: 'register',
                    value: 15
                }
            ]
        });

        expect(result).toEqual(0x5CF0);
    });
});

describe('skp', () => {
    test('skp vx', () => {
        const result = getOpcode({
            operation: 'skp',
            args: [{
                type: 'register',
                value: 12
            }]
        });

        expect(result).toEqual(0xEC9E);
    });
});
