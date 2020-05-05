import { AsmException } from './exceptions';
import { TokenTypes } from './constants';
import {
    Tokens,
    TokenStream,
} from './tokens';


class TokenizerException extends AsmException {
    constructor(column, line, character) {
        super({column, line}, `Unexpected token: ${character}`);
    }
}

function tokenize(str) {
    const tokens = [];
    let currentStr = str;
    let column = 1;
    let line = 1;

    while (currentStr.length > 0) {
        let tokenMatched = false;

        for (const token of Tokens) {
            const match = currentStr.match(token.match);
            if (match === null)
                continue;
            
            if (match.index !== 0)
                continue;
            
            const result = match[0];
            tokenMatched = true;
            currentStr = currentStr.slice(result.length);

            tokens.push({
                type: token.type,
                value: 'value' in token ? token.value(result) : result,
                raw: result,
                column,
                line,
            });

            if (token.type === TokenTypes.EOL) {
                line += 1;
                column = 1;
            } else {
                column += result.length;
            }

            break;
        }

        if (tokenMatched === false)
            throw new TokenizerException(column, line, currentStr.charAt(0));
    }

    tokens.push({
        type: TokenTypes.EOF
    });

    return new TokenStream(tokens);
}

export default tokenize;