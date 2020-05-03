import {
    Tokens,
    TokenTypes
} from './tokens';


class TokenStream {
    constructor(tokens) {
        this.offset = 0;
        this.tokens = tokens;
    }

    skip(...typesToSkip) {
        while (this.hasNext()) {
            if (!typesToSkip.includes(this.peek().type))
                break;
            
            this.next();
        }
    }

    next() {
        const nextToken = this.tokens[this.offset];
        this.offset++;

        return nextToken;
    }

    peek() {
        return this.tokens[this.offset];
    }

    hasNext() {
        return this.offset < this.tokens.length;
    }

    context() {
        return this.tokens
            .slice(Math.max(0, this.offset - 2), this.offset + 2)
            .map((t) => t.raw)
            .join('');
    }
}

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

        if (tokenMatched === false) {
            throw {
                context: currentStr.slice(0, 10),
                column,
                line,
            };
        }
    }

    tokens.push({
        type: TokenTypes.EOF
    });

    return new TokenStream(tokens);
}

export default tokenize;