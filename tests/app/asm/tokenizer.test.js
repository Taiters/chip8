import tokenize from 'chip8/app/asm/tokenizer';
import { TokenTypes } from 'chip8/app/asm/tokens';


describe('tokenize', () => {
    test('single command', () => {
        const input = 'sne vF,  0x44';
        expect(tokenize(input)).toEqual([
            {
                type: TokenTypes.INSTRUCTION,
                value: 'sne',
                raw: 'sne',
                column: 1,
                line: 1,
            },
            {
                type: TokenTypes.WS,
                value: ' ',
                raw: ' ',
                column: 4,
                line: 1,
            },
            {
                type: TokenTypes.REGISTER,
                value: 15,
                raw: 'vF',
                column: 5,
                line: 1,
            },
            {
                type: TokenTypes.COMMA,
                value: ',',
                raw: ',',
                column: 7,
                line: 1,
            },
            {
                type: TokenTypes.WS,
                value: '  ',
                raw: '  ',
                column: 8,
                line: 1,
            },
            {
                type: TokenTypes.HEX_BYTE,
                value: 68,
                raw: '0x44',
                column: 10,
                line: 1,
            },
        ]);
    });

    test('multi line', () => {
        const input = 'sne vF,  0x44\nret';
        expect(tokenize(input)).toEqual([
            {
                type: TokenTypes.INSTRUCTION,
                value: 'sne',
                raw: 'sne',
                column: 1,
                line: 1,
            },
            {
                type: TokenTypes.WS,
                value: ' ',
                raw: ' ',
                column: 4,
                line: 1,
            },
            {
                type: TokenTypes.REGISTER,
                value: 15,
                raw: 'vF',
                column: 5,
                line: 1,
            },
            {
                type: TokenTypes.COMMA,
                value: ',',
                raw: ',',
                column: 7,
                line: 1,
            },
            {
                type: TokenTypes.WS,
                value: '  ',
                raw: '  ',
                column: 8,
                line: 1,
            },
            {
                type: TokenTypes.HEX_BYTE,
                value: 68,
                raw: '0x44',
                column: 10,
                line: 1,
            },
            {
                type: TokenTypes.EOL,
                value: '\n',
                raw: '\n',
                column: 14,
                line: 1,
            },
            {
                type: TokenTypes.INSTRUCTION,
                value: 'ret',
                raw: 'ret',
                column: 1,
                line: 2,
            }
        ]);
    });

    test('inline comment then EOL', () => {
        const input = 'sne vF,  0x44 // next line below\nret';
        expect(tokenize(input)).toEqual([
            {
                type: TokenTypes.INSTRUCTION,
                value: 'sne',
                raw: 'sne',
                column: 1,
                line: 1,
            },
            {
                type: TokenTypes.WS,
                value: ' ',
                raw: ' ',
                column: 4,
                line: 1,
            },
            {
                type: TokenTypes.REGISTER,
                value: 15,
                raw: 'vF',
                column: 5,
                line: 1,
            },
            {
                type: TokenTypes.COMMA,
                value: ',',
                raw: ',',
                column: 7,
                line: 1,
            },
            {
                type: TokenTypes.WS,
                value: '  ',
                raw: '  ',
                column: 8,
                line: 1,
            },
            {
                type: TokenTypes.HEX_BYTE,
                value: 68,
                raw: '0x44',
                column: 10,
                line: 1,
            },
            {
                type: TokenTypes.WS,
                value: ' ',
                raw: ' ',
                column: 14,
                line: 1
            },
            {
                type: TokenTypes.COMMENT,
                value: 'next line below',
                raw: '// next line below',
                column: 15,
                line: 1
            },
            {
                type: TokenTypes.EOL,
                value: '\n',
                raw: '\n',
                column: 33,
                line: 1,
            },
            {
                type: TokenTypes.INSTRUCTION,
                value: 'ret',
                raw: 'ret',
                column: 1,
                line: 2,
            }
        ]);
    });
});