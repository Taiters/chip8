import { AsmException } from '../exceptions';


class UnexpectedTokenException extends AsmException{
    constructor(token, expectedTypes) {
        const types = [...expectedTypes].join(',');
        super(token, `Unexpected token ${token.type}. Expected one of: ${types}`);
    }
}

class UnknownInstructionException extends AsmException {
    constructor(token) {
        super(token, `Unknown instruction: ${token.value}`);
    }
}

class ValidationException extends AsmException {
    constructor(token, err) {
        super(token, err);
    }
}


export {
    UnexpectedTokenException,
    UnknownInstructionException,
    ValidationException,
};