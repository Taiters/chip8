class AsmException {
    constructor({line, column}, message) {
        this.line = line;
        this.column = column;
        this.message = message;
    }
}


export {
    AsmException,
};