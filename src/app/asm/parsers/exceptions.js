class UnexpectedTokenException {
    constructor(token, context, expectedTypes) {
        this.token = token;
        this.context = context;
        this.expected = expectedTypes;
    }
}

class UnknownInstructionException {
    constructor(token) {
        this.token = token;
    }
}

class ValidationException {
    constructor(err, token) {
        this.err = err;
        this.token = token;
    }
}


export {
    UnexpectedTokenException,
    UnknownInstructionException,
    ValidationException,
};