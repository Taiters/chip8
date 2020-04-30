class UnexpectedTokenException {
    constructor(token, context, expectedTypes) {
        this.token = token;
        this.context = context;
        this.expected = expectedTypes;
    }
}


export {
    UnexpectedTokenException
};