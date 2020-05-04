import { TokenTypes } from 'chip8/app/asm/tokens';
import Arguments from 'chip8/app/asm/arguments';
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
        
        const registerToken = token(TokenTypes.REGISTER, 'foo');
        const tokens = new TokenStream([registerToken]);
        const result = parser.parse(tokens);

        expect(result).toEqual([{
            type: Arguments.REGISTER,
            token: registerToken,
        }]);
    });

    test('parse single argument with validation', () => {
        const validator = (value) => [value < 5, 'Should be less than 5'];
        const parser = ArgsParser.builder()
            .addValidatedArgTypes(Arguments.REGISTER, [TokenTypes.REGISTER], validator)
            .build();
        
        const registerToken = token(TokenTypes.REGISTER, 3)
        const tokens = new TokenStream([registerToken]);
        const result = parser.parse(tokens);

        expect(result).toEqual([{
            type: Arguments.REGISTER,
            token: registerToken,
        }]);
    });

    test('parse single argument with multiple types', () => {
        const parser = ArgsParser.builder()
            .addArgTypes('foo', [TokenTypes.REGISTER, TokenTypes.HEX, TokenTypes.DEC])
            .build();
        
        const decToken = token(TokenTypes.DEC, 123);
        const tokens = new TokenStream([decToken]);
        const result = parser.parse(tokens);

        expect(result).toEqual([{
            type: 'foo',
            token: decToken,
        }]);
    });

    test('parse multiple arguments', () => {
        const parser = ArgsParser.builder()
            .addArgTypes('a', [TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes('b', [TokenTypes.REGISTER, TokenTypes.HEX, TokenTypes.DEC])
                .build())
            .build();
        
        const aToken = token(TokenTypes.REGISTER, 'bar');
        const bToken = token(TokenTypes.HEX, 40);
        const tokens = new TokenStream([
            aToken,
            token(TokenTypes.WS),
            token(TokenTypes.COMMA),
            token(TokenTypes.WS),
            bToken,
        ]);
        const result = parser.parse(tokens);

        expect(result).toEqual([
            {
                type: 'a',
                token: aToken,
            },
            {
                type: 'b',
                token: bToken,
            }
        ]);
    });

    test('parse multiple arguments with validation', () => {
        const validator = (value) => [value == 3, 'Should equal 3'];
        const parser = ArgsParser.builder()
            .addValidatedArgTypes('a', [TokenTypes.REGISTER], validator, ArgsParser.builder()
                .addArgTypes('b', [TokenTypes.REGISTER, TokenTypes.HEX, TokenTypes.DEC])
                .build())
            .build();
        
        const aToken = token(TokenTypes.REGISTER, 3);
        const bToken = token(TokenTypes.HEX, 40);
        const tokens = new TokenStream([
            aToken,
            token(TokenTypes.WS),
            token(TokenTypes.COMMA),
            token(TokenTypes.WS),
            bToken,
        ]);
        const result = parser.parse(tokens);

        expect(result).toEqual([
            {
                type: 'a',
                token: aToken,
            },
            {
                type: 'b',
                token: bToken,
            }
        ]);
    });

    test('parse multiple arguments with different paths', () => {
        const parser = ArgsParser.builder()
            .addArgTypes('a', [TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes('b', [TokenTypes.HEX, TokenTypes.DEC])
                .build())
            .addArgTypes('c', [TokenTypes.HEX, TokenTypes.DEC])
            .build();

        const aToken = token(TokenTypes.REGISTER, 3);
        const bToken = token(TokenTypes.HEX, 40);
        const cToken = token(TokenTypes.DEC, 54321);
        const regThenHex = new TokenStream([
            aToken,
            token(TokenTypes.WS),
            token(TokenTypes.COMMA),
            token(TokenTypes.WS),
            bToken,
        ]);
        const decOnly = new TokenStream([cToken]);

        const regThenHexResult = parser.parse(regThenHex);
        const decOnlyResult = parser.parse(decOnly);

        expect(regThenHexResult).toEqual([
            {
                type: 'a',
                token: aToken,
            },
            {
                type: 'b',
                token: bToken,
            }
        ]);
        expect(decOnlyResult).toEqual([
            {
                type: 'c',
                token: cToken,
            }
        ]);
    });

    test('parse no args returns empty args result', () => {
        const parser = ArgsParser.noArgs();

        const tokens = new TokenStream([token(TokenTypes.EOL)]);
        const result = parser.parse(tokens);

        expect(result).toEqual([]);
    })

    test('throws exception if first argument is wrong type', () => {
        const parser = ArgsParser.builder()
            .addArgTypes('a', [TokenTypes.REGISTER])
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.HEX, 3),
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });

    test('throws exception if subsequent argument is wrong type', () => {
        const parser = ArgsParser.builder()
            .addArgTypes('a', [TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes('b', [TokenTypes.HEX])
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
            .addArgTypes('a', [TokenTypes.REGISTER])
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.EOL),
        ]);

        expect(() => parser.parse(tokens)).toThrow(UnexpectedTokenException);
    });

    test('throws exception if subsequent argument is not present', () => {
        const parser = ArgsParser.builder()
            .addArgTypes('a', [TokenTypes.REGISTER], ArgsParser.builder()
                .addArgTypes('b', [TokenTypes.HEX])
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
            .addValidatedArgTypes('a', [TokenTypes.REGISTER], validator, ArgsParser.builder()
                .addArgTypes('b', [TokenTypes.HEX])
                .build())
            .build();

        const tokens = new TokenStream([
            token(TokenTypes.REGISTER, 7),
        ]);

        expect(() => parser.parse(tokens)).toThrow(ValidationException);
    });
});