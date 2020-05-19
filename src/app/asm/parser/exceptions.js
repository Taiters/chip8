// @flow
import type { Token } from '../tokens';
import type { TokenType, Operand } from '../constants';
import { AsmException } from '../exceptions';


class UnexpectedTokenException extends AsmException {
    constructor(token: Token, expectedTypes: Array<TokenType> | Set<TokenType>) {
        const types = [...expectedTypes].join(',');
        super(token, `Unexpected token ${token.type} (${token.value}). Expected one of: ${types}`);
    }
}

class UnexpectedOperandException extends AsmException {
    constructor(token: Token, definedOperand: ?Object, expectedOperands: Array<Operand> | Set<Operand>) {
        const operands = [...expectedOperands].join(',');
        const type = definedOperand ? definedOperand.type : token.type;
        super(token, `Unexpected operand ${token.raw} (${type}). Expected one of: ${operands}`);
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
    UnexpectedOperandException,
    UnknownInstructionException,
    ValidationException,
    ExistingLabelException,
};