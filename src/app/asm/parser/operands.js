// @flow
import type { Operand, TokenType } from '../constants';
import type { TokenStream } from './tokenStream';
import type { Token } from '../tokens';
import { expectNextToken } from './utils';
import { Operands, TokenTypes } from '../constants';
import {
    UnexpectedTokenException,
    ValidationException
} from './exceptions';


type OperandDefinition = {
    type: Operand,
    types: Array<TokenType>,
    validator(value: any): [boolean, string],
};

const noValidator = () => [true, ''];

const OperandDefinitions: Map<Operand, OperandDefinition> = new Map([
    [Operands.REGISTER, {
        type: Operands.REGISTER,
        types: [TokenTypes.REGISTER],
        validator: noValidator,
    }],
    [Operands.ADDRESS, {
        type: Operands.ADDRESS,
        types: [TokenTypes.IDENTIFIER],
        validator: noValidator,
    }],
    [Operands.BYTE, {
        type: Operands.BYTE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xFF, 'Invalid byte value'],
    }],
    [Operands.NIBBLE, {
        type: Operands.NIBBLE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xF, 'Invalid 4 bit value'],
    }],
    [Operands.DELAY_TIMER, {
        type: Operands.DELAY_TIMER,
        types: [TokenTypes.DELAY_TIMER],
        validator: noValidator,
    }],
    [Operands.SOUND_TIMER, {
        type: Operands.SOUND_TIMER,
        types: [TokenTypes.SOUND_TIMER],
        validator: noValidator,
    }],
    [Operands.K, {
        type: Operands.K,
        types: [TokenTypes.K],
        validator: noValidator,
    }],
    [Operands.F, {
        type: Operands.F,
        types: [TokenTypes.F],
        validator: noValidator,
    }],
    [Operands.I, {
        type: Operands.I,
        types: [TokenTypes.I],
        validator: noValidator,
    }],
    [Operands.B, {
        type: Operands.B,
        types: [TokenTypes.B],
        validator: noValidator,
    }]
]);

function operand(key: Operand): ?OperandDefinition {
    return OperandDefinitions.get(key);
}

type OperandParserDefinition = {
    operandDefinition: OperandDefinition,
    next: ?OperandsParser,
};

// Parses <menomic> [operand, ...]
class OperandsParser {
    operandParserDefinitions: Array<OperandParserDefinition>;

    constructor(operandParserDefinitions: Array<OperandParserDefinition>) {
        this.operandParserDefinitions = operandParserDefinitions;
    }

    getOperandToken(tokens: TokenStream, definitions: Map<string, Token>): Token {
        const token = tokens.next();

        if (token.type === TokenTypes.IDENTIFIER && typeof token.value === 'string')
            return definitions.get(token.value) || token;
        
        return token;
    }

    parse(tokens: TokenStream, definitions: Map<string, Token>) {
        const operands = [];
        if (this.operandParserDefinitions.length == 0)
            return operands;

        const operandToken = this.getOperandToken(tokens, definitions);

        for(const parserDefinition of this.operandParserDefinitions) {
            const operandDefinition = parserDefinition.operandDefinition;
            if (operandDefinition.types.includes(operandToken.type)) {
                const value = operandToken.value;
                const [result, err] = operandDefinition.validator(value);

                if (!result)
                    throw new ValidationException(operandToken, err);

                operands.push({
                    type: operandDefinition.type,
                    token: operandToken,
                });
                if (parserDefinition.next != null) {
                    const next = parserDefinition.next;
                    tokens.skip(TokenTypes.WS);
                    expectNextToken(tokens, TokenTypes.COMMA);
                    tokens.skip(TokenTypes.WS);

                    return operands.concat(next.parse(tokens, definitions));
                } else {
                    return operands;
                }
            }
        }

        const allOperandTypes = this.operandParserDefinitions.reduce((types, definition) => {
            for(const type of definition.operandDefinition.types) {
                types.add(type);
            }

            return types;
        }, new Set());

        throw new UnexpectedTokenException(operandToken, allOperandTypes);
    }

    static arg(operandDefinition: OperandDefinition): OperandsParser {
        return OperandsParser.builder()
            .addOperand(operandDefinition)
            .build();
    }

    static noArgs(): OperandsParser {
        return new OperandsParser([]);
    }

    static builder(): OperandsParserBuilder {
        return new OperandsParserBuilder();
    }
}

class OperandsParserBuilder {
    operandParserDefinitions: Array<OperandParserDefinition>;
    constructor() {
        this.operandParserDefinitions = [];
    }

    addOperand(operandDefinition: OperandDefinition, next: ?OperandsParser): OperandsParserBuilder {
        this.operandParserDefinitions.push({
            operandDefinition,
            next,
        });
        return this;
    }

    build(): OperandsParser {
        return new OperandsParser(this.operandParserDefinitions);
    }
}

export {
    OperandsParser,
    operand,
};