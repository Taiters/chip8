import assembler from 'chip8/assembler/assembler.js';


describe('assemble', () => {
    test('returns expected opcodes', () => {
        const ast = require('../_fixtures/test.ast.json');
        const result = assembler.assemble(ast);

        expect(result).toEqual(Uint8Array.from(
            [
                34,
                10,
                18,
                4,
                34,
                18,
                34,
                26,
                18,
                4,
                98,
                28,
                99,
                14,
                162,
                44,
                210,
                52,
                96,
                5,
                224,
                158,
                18,
                18,
                0,
                238,
                97,
                30,
                241,
                21,
                241,
                24,
                34,
                36,
                0,
                238,
                241,
                7,
                49,
                0,
                18,
                36,
                0,
                238,
                68,
                16,
                130,
                124
            ]
        ));
    });
});

describe('buildAddressMap', () => {
    test('returns expected addresses no data', () => {
        const result = assembler.buildAddressMap([
            {
                label: null,
                instructions: [
                    'an instruction',
                    'another one'
                ]
            },
            {
                label: 'func',
                instructions: [
                    'some more',
                    'instructions',
                    'could go here'
                ]
            },
            {
                label: 'anotherFunc',
                instructions: [
                    'even',
                    'more instructions'
                ]
            }
        ], []);

        expect(result).toEqual({
            func: 0x204,
            anotherFunc: 0x20A
        });
    });
});

describe('mapInstructionLabelsToAddress', () => {
    test('ignores instruction with no labels', () => {
        const result = assembler.mapInstructionLabelsToAddress({
            operation: 'ld',
            args: [{
                type: 'register',
                value: 5
            }]
        }, {
            'foo': 0x206
        });

        expect(result).toEqual({
            operation: 'ld',
            args: [{
                type: 'register',
                value: 5
            }]
        });
    });

    test('maps labels to addresses', () => {
        const result = assembler.mapInstructionLabelsToAddress({
            operation: 'ld',
            args: [
                {
                    type: 'register',
                    value: 5
                },
                {
                    type: 'label',
                    value: 'foo'
                }
            ]
        }, {
            'foo': 0x206
        });

        expect(result).toEqual({
            operation: 'ld',
            args: [
                {
                    type: 'register',
                    value: 5
                },
                {
                    type: 'address',
                    value: 0x206
                }
            ]
        });
    });
});
