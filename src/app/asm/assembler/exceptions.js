// @flow
import type { Token } from '../tokens';
import { AsmException } from '../exceptions';


class UnknownInstructionException extends AsmException {
    constructor(token: Token) {
        super(token, `Unknown instruction: ${token.value}`);
    }
}

class LabelNotFoundException extends AsmException {
    constructor(token: Token) {
        super(token, `Section not found: ${token.value}`);
    }
}


export {
    UnknownInstructionException,
    LabelNotFoundException,
};