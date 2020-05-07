import { Tokens } from './tokens';
import { TokenTypes } from './constants';
import { AsmException } from './exceptions';


class NoTokenMatchedException extends AsmException {
    constructor(line, column, src) {
        super({line, column}, `No token matched at: ${src}`);
    }
}

class TokenStream {
    constructor(src) {
        this.remainingSrc = src;
        this.currentLine = 1;
        this.currentColumn = 1;

        this.nextToken = null;
    }

    readNextToken() {
        for (const token of Tokens) {
            const match = this.remainingSrc.match(token.match);
            if (match === null || match.index !== 0)
                continue;
            
            const result = match[0];
            this.remainingSrc = this.remainingSrc.slice(result.length);

            const nextToken = {
                type: token.type,
                value: 'value' in token ? token.value(result) : result,
                raw: result,
                column: this.currentColumn,
                line: this.currentLine,
            };

            if (token.type === TokenTypes.EOL) {
                this.currentLine += 1;
                this.currentColumn = 1;
            } else {
                this.currentColumn += result.length;
            }

            return nextToken;
        }

        throw new NoTokenMatchedException(
            this.currentLine,
            this.currentColumn,
            this.remainingSrc.split(/\n/)[0]);
    }

    skip(...typesToSkip) {
        let nextToken = this.peek();
        while (nextToken.type !== TokenTypes.EOF) {
            if (!typesToSkip.includes(nextToken.type))
                break;

            this.next();
            nextToken = this.peek();
        }
    }

    next() {
        if (this.nextToken) {
            const nextToken = this.nextToken;
            this.nextToken = null;

            return nextToken;
        }

        return this.readNextToken();
    }

    peek() {
        if (this.nextToken)
            return this.nextToken;

        this.nextToken = this.readNextToken();
        return this.nextToken;
    }
}


export default TokenStream;