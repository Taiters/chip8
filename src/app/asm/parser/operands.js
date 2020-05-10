import { expectNextToken } from './utils';
import {
    Operands,
    TokenTypes
} from '../constants';
import {
    UnexpectedTokenException,
    ValidationException
} from './exceptions';


const OperandDefinitions = {
    REGISTER: {
        type: Operands.REGISTER,
        types: [TokenTypes.REGISTER]
    },
    ADDRESS: {
        type: Operands.ADDRESS,
        types: [TokenTypes.SECTION_IDENTIFIER]
    },
    BYTE: {
        type: Operands.BYTE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xFF, 'Invalid byte value'],
    },
    NIBBLE: {
        type: Operands.NIBBLE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xF, 'Invalid 4 bit value'],
    },
    DELAY_TIMER: {
        type: Operands.DELAY_TIMER,
        types: [TokenTypes.DELAY_TIMER],
    },
    SOUND_TIMER: {
        type: Operands.SOUND_TIMER,
        types: [TokenTypes.SOUND_TIMER],
    },
    KEY: {
        type: Operands.K,
        types: [TokenTypes.K],
    },
    FONT: {
        type: Operands.F,
        types: [TokenTypes.F],
    },
    I: {
        type: Operands.I,
        types: [TokenTypes.I],
    },
    B: {
        type: Operands.B,
        types: [TokenTypes.B],
    }
};

// Parses <menomic> [operand, ...]
class OperandsParser {
    constructor(operandDefinitions) {
        this.operandDefinitions = operandDefinitions;
    }

    parse(tokens) {
        const operands = [];
        if (this.operandDefinitions.length == 0)
            return operands;

        const operandToken = tokens.next();
        for(const operandDefinition of this.operandDefinitions) {
            if (operandDefinition.types.includes(operandToken.type)) {
                const value = operandToken.value;
                if (operandDefinition.validator) {
                    const [result, err] = operandDefinition.validator(value);
                    if (!result)
                        throw new ValidationException(operandToken, err);
                }

                operands.push({
                    type: operandDefinition.type,
                    token: operandToken,
                });
                if (operandDefinition.next) {
                    tokens.skip(TokenTypes.WS);
                    expectNextToken(tokens, TokenTypes.COMMA);
                    tokens.skip(TokenTypes.WS);

                    return operands.concat(operandDefinition.next.parse(tokens));
                } else {
                    return operands;
                }
            }
        }

        const allOperandTypes = this.operandDefinitions.reduce((types, definition) => {
            for(const type of definition.types) {
                types.add(type);
            }

            return types;
        }, new Set());

        throw new UnexpectedTokenException(operandToken, allOperandTypes);
    }

    static arg(operandDefinition) {
        return OperandsParser.builder()
            .addOperand(operandDefinition)
            .build();
    }

    static noArgs() {
        return new OperandsParser([]);
    }

    static builder() {
        return new OperandsParserBuilder();
    }
}

class OperandsParserBuilder {
    constructor() {
        this.operandDefinitions = [];
    }

    addOperand(operandDefinition, next) {
        this.operandDefinitions.push({
            type: operandDefinition.type,
            types: operandDefinition.types,
            validator: operandDefinition.validator,
            next: next
        });
        return this;
    }

    build() {
        return new OperandsParser(this.operandDefinitions);
    }
}


export {
    OperandsParser,
    OperandDefinitions,
};