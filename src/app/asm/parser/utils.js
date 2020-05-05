import {
    UnexpectedTokenException,
} from './exceptions';


function expectNextToken(tokens, ...validTokens) {
    const nextToken = tokens.next();
    if (!validTokens.includes(nextToken.type)) {
        throw new UnexpectedTokenException(nextToken, validTokens);
    }

    return nextToken;
}


export {
    expectNextToken
};