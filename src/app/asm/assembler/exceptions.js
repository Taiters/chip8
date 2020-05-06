import { AsmException } from '../exceptions';


class UnknownInstructionException extends AsmException {
    constructor(token) {
        super(token, `Unknown instruction: ${token.value}`);
    }
}

class SectionNotFoundException extends AsmException {
    constructor(token) {
        super(token, `Section not found: ${token.value}`);
    }
}


export {
    UnknownInstructionException,
    SectionNotFoundException,
};