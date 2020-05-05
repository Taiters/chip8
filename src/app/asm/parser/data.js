import { TokenTypes } from '../constants';
import { expectNextToken } from './utils';
import { ValidationException } from './exceptions';


const DATA_TOKENS = [
    TokenTypes.HEX,
    TokenTypes.BIN,
    TokenTypes.DEC,
];

class DataParser {
    parse(tokens) {
        const token = expectNextToken(tokens, ...DATA_TOKENS);
        if (0 <= token.value && token.value <= 255) {
            return token;
        }

        throw new ValidationException('Invalid byte in data', token);
    }
}


export default DataParser;