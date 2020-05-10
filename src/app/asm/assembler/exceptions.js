import { AsmException } from '../exceptions';


class UnknownInstructionException extends AsmException {
    constructor(token) {
        super(token, `Unknown instruction: ${token.value}`);
    }
}

class LabelNotFoundException extends AsmException {
    constructor(token) {
        super(token, `Section not found: ${token.value}`);
    }
}


export {
    UnknownInstructionException,
    LabelNotFoundException,
};