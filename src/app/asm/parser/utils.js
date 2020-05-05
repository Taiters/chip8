import {
    UnexpectedTokenException,
} from './exceptions';


function expectNextToken(tokens, ...validTokens) {
    const nextToken = tokens.next();
    if (!validTokens.includes(nextToken.type))
        throw new UnexpectedTokenException(nextToken, tokens.context(), validTokens);

    return nextToken;
}


export {
    expectNextToken
};