import {
    Tokens,
    TokenTypes
} from './tokens';


function tokenize(str) {
    let currentStr = str;
    let tokens = [];
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
                value: token.value(result),
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

        if (tokenMatched === false) {
            throw {
                context: currentStr.slice(0, 10),
                column,
                line,
            };
        }
    }

    return tokens;
}

export default tokenize;