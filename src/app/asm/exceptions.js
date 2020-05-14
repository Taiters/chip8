// @flow
import type { Token } from './tokens';


class AsmException {
    token: Token;
    message: string;

    constructor(token: Token, message: string) {
        this.token = token;
        this.message = message;
    }
}


export {
    AsmException,
};