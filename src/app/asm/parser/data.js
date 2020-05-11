// @flow
import { TokenTypes, LineTypes } from '../constants';
import { TokenStream } from './tokenStream';
import { expectNextToken } from './utils';
import { ValidationException } from './exceptions';


const DATA_TOKENS = [
    TokenTypes.HEX,
    TokenTypes.BIN,
    TokenTypes.DEC,
];

class DataParser {
    parse(tokens: TokenStream) {
        const token = expectNextToken(tokens, ...DATA_TOKENS);
        const value = token.value;

        if (typeof value === 'number' && 0 <= value && value <= 0xFF) {
            return {
                type: LineTypes.DATA,
                token,
            };
        }

        throw new ValidationException(token, `Invalid byte value: ${value}`);
    }
}


export {
    DataParser,
};
