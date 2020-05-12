// @flow
import type { Token } from '../tokens';
import type { TokenType } from '../constants';
import { Tokens } from '../tokens';
import { TokenTypes } from '../constants';


class TokenStream {
    remainingSrc: string
    currentLine: number
    currentColumn: number
    nextToken: ?Token

    constructor(src: string) {
        this.remainingSrc = src;
        this.currentLine = 0;
        this.currentColumn = 0;

        this.nextToken = null;
    }

    readNextToken(): Token {
        for (const token of Tokens) {
            const match = this.remainingSrc.match(token.match);
            if (match === null || match.index !== 0)
                continue;
            
            const result = match[0];
            this.remainingSrc = this.remainingSrc.slice(result.length);

            const nextToken: Token = {
                type: token.type,
                value: 'value' in token ? token.value(result) : result,
                raw: result,
                column: this.currentColumn,
                line: this.currentLine,
            };

            if (token.type === TokenTypes.EOL) {
                this.currentLine += 1;
                this.currentColumn = 0;
            } else {
                this.currentColumn += result.length;
            }

            return nextToken;
        }

        throw 'Unexpected token';
    }

    skip(...typesToSkip: Array<TokenType>) {
        let nextToken = this.peek();
        while (nextToken.type !== TokenTypes.EOF) {
            if (!typesToSkip.includes(nextToken.type))
                break;

            this.next();
            nextToken = this.peek();
        }
    }

    next(): Token {
        if (this.nextToken) {
            const nextToken = this.nextToken;
            this.nextToken = null;

            return nextToken;
        }

        return this.readNextToken();
    }

    peek(): Token {
        if (this.nextToken)
            return this.nextToken;

        this.nextToken = this.readNextToken();
        return this.nextToken;
    }
}


export {
    TokenStream,
};