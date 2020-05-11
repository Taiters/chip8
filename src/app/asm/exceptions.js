// @flow
import type { Token } from './tokens';


class AsmException {
    line: number;
    column: number;
    message: string;

    constructor(token: Token, message: string) {
        this.line = token.line;
        this.column = token.column;
        this.message = message;
    }
}


export {
    AsmException,
};