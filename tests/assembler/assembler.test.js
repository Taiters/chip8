import assembler from 'chip8/assembler/assembler.js';


describe('assemble', () => {
    test('returns expected opcodes', () => {
        const ast = require('../_fixtures/test.ast.json');
        const result = assembler.assemble(ast);
        
        expect(result).toEqual(Uint8Array.from([
            34, 
            6, 
            34, 
            14, 
            18, 
            0, 
            96, 
            5, 
            224, 
            158, 
            18, 
            6, 
            0, 
            238, 
            97, 
            255, 
            241, 
            21, 
            241, 
            24, 
            34, 
            24, 
            0, 
            238, 
            241, 
            7, 
            49, 
            0, 
            18, 
            24, 
            0, 
            238
        ]));
    });
});

describe('buildAddressMap', () => {
    test('returns expected addresses', () => {
        const result = assembler.buildAddressMap({
            sections: [
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
            ]
        });

        expect(result).toEqual({
            func: 0x204,
            anotherFunc: 0x20A
        });
    });
});

describe('mapInstructionLabels', () => {
    test('ignores instruction with no labels', () => {
        const result = assembler.mapInstructionLabels({
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
        const result = assembler.mapInstructionLabels({
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
