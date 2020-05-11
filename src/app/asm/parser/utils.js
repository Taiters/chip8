// @flow
import type { Token } from '../tokens';
import type { TokenType } from '../constants';
import type { TokenStream } from './tokenStream';
import {
    UnexpectedTokenException,
} from './exceptions';


function expectNextToken(tokens: TokenStream, ...validTokens: Array<TokenType>): Token {
    const nextToken = tokens.next();
    if (!validTokens.includes(nextToken.type)) {
        throw new UnexpectedTokenException(nextToken, validTokens);
    }

    return nextToken;
}


export {
    expectNextToken
};