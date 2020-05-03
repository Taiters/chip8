import { TokenTypes } from '../tokens';
import { expectNextToken } from './utils';


class DataParser {
    parse(tokens) {
        return expectNextToken(tokens, TokenTypes.BIN);
    }
}


export default DataParser;