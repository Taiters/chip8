// @flow
import type { Token } from '../tokens';
import type { TokenType } from '../constants';
import { AsmException } from '../exceptions';


class UnexpectedTokenException extends AsmException{
    constructor(token: Token, expectedTypes: Array<TokenType> | Set<TokenType>) {
        const types = [...expectedTypes].join(',');
        super(token, `Unexpected token ${token.type} (${token.value}). Expected one of: ${types}`);
    }
}

class UnknownInstructionException extends AsmException {
    constructor(token: Token) {
        super(token, `Unknown instruction: ${token.value}`);
    }
}

class ValidationException extends AsmException {
    constructor(token: Token, err: string) {
        super(token, err);
    }
}

class ExistingLabelException extends AsmException {
    constructor(token: Token) {
        super(token, `Label already in use: ${token.value}`);
    }
}


export {
    UnexpectedTokenException,
    UnknownInstructionException,
    ValidationException,
    ExistingLabelException,
};