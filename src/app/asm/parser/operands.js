// @flow
import type { Operand, TokenType } from '../constants';
import type { TokenStream } from './tokenStream';
import type { Token } from '../tokens';
import { expectNextToken } from './utils';
import { Operands, TokenTypes } from '../constants';
import {
    UnexpectedOperandException,
} from './exceptions';


type OperandDefinition = {
    type: Operand,
    types: Array<TokenType>,
    validator(value: any): boolean,
    valueParser(Token, TokenStream): any,
};

const noValidator = () => true;

const tokenValue = (token) => token.value;
const addressValue = (token, tokens) => {
    const identifier = token.value;
    let offset = 0;

    tokens.skip(TokenTypes.WS);
    const nextToken = tokens.peek();

    if (nextToken.type === TokenTypes.PLUS) {
        tokens.next();
        tokens.skip(TokenTypes.WS);
        const offsetToken = expectNextToken(tokens,
            TokenTypes.DEC,
            TokenTypes.BIN,
            TokenTypes.HEX);
        
        offset = offsetToken.value;
    }

    return {
        identifier,
        offset,
    };
};

const OperandDefinitions: Map<Operand, OperandDefinition> = new Map([
    [Operands.REGISTER, {
        type: Operands.REGISTER,
        types: [TokenTypes.REGISTER],
        validator: noValidator,
        valueParser: tokenValue,
    }],
    [Operands.ADDRESS, {
        type: Operands.ADDRESS,
        types: [TokenTypes.IDENTIFIER],
        validator: noValidator,
        valueParser: addressValue,
    }],
    [Operands.BYTE, {
        type: Operands.BYTE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => 0 <= value && value <= 0xFF,
        valueParser: tokenValue,
    }],
    [Operands.NIBBLE, {
        type: Operands.NIBBLE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => 0 <= value && value <= 0xF,
        valueParser: tokenValue,
    }],
    [Operands.DELAY_TIMER, {
        type: Operands.DELAY_TIMER,
        types: [TokenTypes.DELAY_TIMER],
        validator: noValidator,
        valueParser: tokenValue,
    }],
    [Operands.SOUND_TIMER, {
        type: Operands.SOUND_TIMER,
        types: [TokenTypes.SOUND_TIMER],
        validator: noValidator,
        valueParser: tokenValue,
    }],
    [Operands.K, {
        type: Operands.K,
        types: [TokenTypes.K],
        validator: noValidator,
        valueParser: tokenValue,
    }],
    [Operands.F, {
        type: Operands.F,
        types: [TokenTypes.F],
        validator: noValidator,
        valueParser: tokenValue,
    }],
    [Operands.I, {
        type: Operands.I,
        types: [TokenTypes.I],
        validator: noValidator,
        valueParser: tokenValue,
    }],
    [Operands.B, {
        type: Operands.B,
        types: [TokenTypes.B],
        validator: noValidator,
        valueParser: tokenValue,
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

    getDefinedOperand(token: Token, definitions: Map<string, Object>): ?Object {
        const tokenValue = token.value;

        if (token.type === TokenTypes.IDENTIFIER && typeof tokenValue === 'string')
            return definitions.get(tokenValue);
        
        return null;
    }

    continue(operands: Array<any>, definition: OperandParserDefinition, tokens: TokenStream, definitions: Map<string, Object>): Array<any> {
        if (definition.next != null) {
            const next = definition.next;
            tokens.skip(TokenTypes.WS);
            expectNextToken(tokens, TokenTypes.COMMA);
            tokens.skip(TokenTypes.WS);

            return operands.concat(next.parse(tokens, definitions));
        } else {
            return operands;
        }
    }

    parse(tokens: TokenStream, definitions: Map<string, Object>): Array<any> {
        const operands = [];
        if (this.operandParserDefinitions.length == 0)
            return operands;
        
        const token = tokens.next();
        const definedOperand = this.getDefinedOperand(token, definitions);

        if (definedOperand != null) {
            const operandDefinition = this.operandParserDefinitions.find(definition => definition.operandDefinition.type === definedOperand.type);
            if (operandDefinition != null) {
                operands.push(definedOperand);

                return this.continue(operands, operandDefinition, tokens, definitions);
            }

        } else {
            for(const parserDefinition of this.operandParserDefinitions) {
                const operandDefinition = parserDefinition.operandDefinition;
                if (operandDefinition.types.includes(token.type)) {
                    const value = operandDefinition.valueParser(token, tokens);

                    if (!operandDefinition.validator(value))
                        continue;

                    operands.push({
                        type: operandDefinition.type,
                        token,
                        value,
                    });
                    return this.continue(operands, parserDefinition, tokens, definitions);
                }
            }
        }

        const allOperandTypes = this.operandParserDefinitions.map(definition => definition.operandDefinition.type);
        throw new UnexpectedOperandException(token, definedOperand, allOperandTypes);
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