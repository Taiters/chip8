import { TokenTypes } from 'chip8/app/asm/tokens';
import TokenStream from 'chip8/app/asm/tokenStream';
import {
    UnexpectedTokenException,
    ValidationException
} from 'chip8/app/asm/parsers/exceptions';
import ArgsParser, {
    register
} from 'chip8/app/asm/parsers/args';

import { token } from './utils';



describe('ArgsParser', () => {
    test('parse single argument with single type', () => {
        const parser = ArgsParser.builder()
            .addArg(register())
            .build();
        
        const tokens = new TokenStream([token(TokenTypes.REGISTER, 'foo')]);
        const result = parser.parse(tokens);

        expect(result).toEqual(['foo']);
    });

    test('parse single argument with validation', () => {
        const validator = (value) => [value < 5, 'Should be less than 5'];
        const parser = ArgsParser.builder()
            .addValidatedArgTypes([TokenTypes.REGISTER], validator)
            .build();
        
        const tokens = new TokenStream([token(TokenTypes.REGISTER, 3)]);
        const result = parser.parse(tokens);

        expect(result).toEqual([3]);
    });

    test('parse single argument with multiple types', () => {
        const parser = ArgsParser.builder()
            .addArgTypes([TokenTypes.REGISTER, TokenTypes.HEX, TokenTypes.DEC])
            .build();
        
        const tokens = new TokenStream([token(TokenTypes.DEC, 123)]);
        const result = parser.parse(tokens);

        expect(result).toEqual([123]);
    });

    test('parse multiple arguments', () => {
        const parser = ArgsParser.builder()
            .addArgTypes([TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes([TokenTypes.REGISTER, TokenTypes.HEX, TokenTypes.DEC])
                .build())
            .build();
        
        const tokens = new TokenStream([
            token(TokenTypes.REGISTER, 'bar'),
            token(TokenTypes.WS),
            token(TokenTypes.COMMA),
            token(TokenTypes.WS),
            token(TokenTypes.HEX, 40)
        ]);
        const result = parser.parse(tokens);

        expect(result).toEqual(['bar', 40]);
    });

    test('parse multiple arguments with validation', () => {
        const validator = (value) => [value == 3, 'Should equal 3'];
        const parser = ArgsParser.builder()
            .addValidatedArgTypes([TokenTypes.REGISTER], validator, ArgsParser.builder()
                .addArgTypes([TokenTypes.REGISTER, TokenTypes.HEX, TokenTypes.DEC])
                .build())
            .build();
        
        const tokens = new TokenStream([
            token(TokenTypes.REGISTER, 3),
            token(TokenTypes.WS),
            token(TokenTypes.COMMA),
            token(TokenTypes.WS),
            token(TokenTypes.HEX, 40)
        ]);
        const result = parser.parse(tokens);

        expect(result).toEqual([3, 40]);
    });

    test('parse multiple arguments with different paths', () => {
        const parser = ArgsParser.builder()
            .addArgTypes([TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes([TokenTypes.HEX, TokenTypes.DEC])
                .build())
            .addArgTypes([TokenTypes.HEX, TokenTypes.DEC])
            .build();

        const regThenHex = new TokenStream([
            token(TokenTypes.REGISTER, 'bar'),
            token(TokenTypes.WS),
            token(TokenTypes.COMMA),
            token(TokenTypes.WS),
            token(TokenTypes.HEX, 40)
        ]);
        const decOnly = new TokenStream([token(TokenTypes.DEC, 54321)]);

        const regThenHexResult = parser.parse(regThenHex);
        const decOnlyResult = parser.parse(decOnly);

        expect(regThenHexResult).toEqual(['bar', 40]);
        expect(decOnlyResult).toEqual([54321]);
    });

    test('parse no args returns empty args result', () => {
        const parser = ArgsParser.noArgs();

        const tokens = new TokenStream([token(TokenTypes.EOL)]);
        const result = parser.parse(tokens);

        expect(result).toEqual([]);
    })

    test('throws exception if first argument is wrong type', () => {
        const parser = ArgsParser.builder()
            .addArgTypes([TokenTypes.REGISTER])
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.HEX, 3),
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });

    test('throws exception if subsequent argument is wrong type', () => {
        const parser = ArgsParser.builder()
            .addArgTypes([TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes([TokenTypes.HEX])
                .build())
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.REGISTER, 'foo'),
            token(TokenTypes.COMMA),
            token(TokenTypes.DEC, 3)
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });

    test('throws exception if first argument is not present', () => {
        const parser = ArgsParser.builder()
            .addArgTypes([TokenTypes.REGISTER])
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.EOL),
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });

    test('throws exception if subsequent argument is not present', () => {
        const parser = ArgsParser.builder()
            .addArgTypes([TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes([TokenTypes.HEX])
                .build())
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.REGISTER, 'foo'),
            token(TokenTypes.EOL)
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });

    test('throws validation exception if token value fails validation', () => {
        const validator = (value) => [value < 5, 'Should be less than 5'];
        const parser = ArgsParser.builder()
            .addValidatedArgTypes([TokenTypes.REGISTER], validator, ArgsParser.builder()
                .addArgTypes([TokenTypes.HEX])
                .build())
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.REGISTER, 7),
        ]);

        expect(() => parser.parse(tokens)).toThrow(ValidationException);
    });
});