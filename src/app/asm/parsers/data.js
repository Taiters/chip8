import { TokenTypes } from '../tokens';
import { expectNextToken } from './utils';
import { ValidationException } from './exceptions';


class DataParser {
    parse(tokens) {
        const token = expectNextToken(tokens, TokenTypes.BIN);
        if (0 <= token.value && token.value <= 255) {
            return token;
        }

        throw new ValidationException('Invalid byte in data', token);
    }
}


export default DataParser;