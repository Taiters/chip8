import { TokenTypes } from 'chip8/app/asm/tokens';
import SectionParser from 'chip8/app/asm/parsers/section';
import { token } from './utils';
import TokenStream from 'chip8/app/asm/tokenStream';
import { UnexpectedTokenException } from 'chip8/app/asm/parsers/exceptions';


describe('SectionParser', () => {
    test('parse section with no name', () => {
        const lineParser = jest.fn((tokens) => tokens.next().value);
        const parser = SectionParser.builder()
            .addSection('bar section', TokenTypes.BIN)
            .addSection('foo section', TokenTypes.HEX, {
                parse: lineParser
            })
            .build();
        
        const tokens = new TokenStream([
            token(TokenTypes.HEX, 1),
            token(TokenTypes.WS),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 2),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 3),
            token(TokenTypes.WS),
            token(TokenTypes.COMMENT),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 4),
            token(TokenTypes.EOF)
        ]);

        const result = parser.parse(tokens);

        expect(lineParser.mock.calls.length).toBe(4);
        expect(result).toEqual({
            name: null,
            type: 'foo section',
            lines: [1, 2, 3, 4]
        });
    });

    test('parse section with name', () => {
        const lineParser = jest.fn((tokens) => tokens.next().value);
        const parser = SectionParser.builder()
            .addSection('bar section', TokenTypes.BIN)
            .addSection('foo section', TokenTypes.HEX, {
                parse: lineParser
            })
            .build();
        
        const tokens = new TokenStream([
            token(TokenTypes.SECTION_DEFINITION, 'henry_the_section'),
            token(TokenTypes.HEX, 1),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 2),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 3),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 4),
            token(TokenTypes.EOL),
            token(TokenTypes.EOF)
        ]);

        const result = parser.parse(tokens);

        expect(lineParser.mock.calls.length).toBe(4);
        expect(result).toEqual({
            name: 'henry_the_section',
            type: 'foo section',
            lines: [1, 2, 3, 4]
        });
    });

    test('parse stops before a new section', () => {
        const lineParser = jest.fn((tokens) => tokens.next().value);
        const parser = SectionParser.builder()
            .addSection('bar section', TokenTypes.BIN)
            .addSection('foo section', TokenTypes.HEX, {
                parse: lineParser
            })
            .build();
        
        const tokens = new TokenStream([
            token(TokenTypes.SECTION_DEFINITION, 'henry_the_section'),
            token(TokenTypes.HEX, 1),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 2),
            token(TokenTypes.EOL),
            token(TokenTypes.WS),
            token(TokenTypes.HEX, 3),
            token(TokenTypes.EOL),
            token(TokenTypes.HEX, 4),
            token(TokenTypes.EOL),
            token(TokenTypes.COMMENT),
            token(TokenTypes.SECTION_DEFINITION),
        ]);

        const result = parser.parse(tokens);
        expect(lineParser.mock.calls.length).toBe(4);
        expect(result).toEqual({
            name: 'henry_the_section',
            type: 'foo section',
            lines: [1, 2, 3, 4]
        });
        expect(tokens.next().type).toBe(TokenTypes.SECTION_DEFINITION);
    });

    test('throws exception if unknown start token', () => {
        const parser = SectionParser.builder()
            .addSection('bar section', TokenTypes.BIN)
            .addSection('foo section', TokenTypes.HEX)
            .build();
        
        const tokens = new TokenStream([
            token(TokenTypes.SECTION_DEFINITION, 'henry_the_section'),
            token(TokenTypes.COMMA, 1),
            token(TokenTypes.EOL),
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });

    test('throws exception if a line does not begin with expected start token', () => {
        const lineParser = jest.fn((tokens) => tokens.next().valule);
        const parser = SectionParser.builder()
            .addSection('bar section', TokenTypes.BIN, {
                parse: lineParser
            })
            .addSection('foo section', TokenTypes.HEX)
            .build();
        
        const tokens = new TokenStream([
            token(TokenTypes.SECTION_DEFINITION, 'henry_the_section'),
            token(TokenTypes.BIN, 1),
            token(TokenTypes.EOL),
            token(TokenTypes.WS),
            token(TokenTypes.DEC),
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });
});