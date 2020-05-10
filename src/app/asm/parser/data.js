import { TokenTypes } from '../constants';
import { expectNextToken } from './utils';
import { ValidationException } from './exceptions';


const DATA_TOKENS = [
    TokenTypes.HEX,
    TokenTypes.BIN,
    TokenTypes.DEC,
];

// parses single byte from <hex|bin|dec>
class DataParser {
    parse(tokens) {
        const token = expectNextToken(tokens, ...DATA_TOKENS);
        if (0 <= token.value && token.value <= 0xFF) {
            return token;
        }

        throw new ValidationException('Invalid byte in data', token);
    }
}


export {
    DataParser,
};