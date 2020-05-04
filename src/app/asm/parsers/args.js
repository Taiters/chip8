import Arguments from '../arguments';
import { TokenTypes } from '../tokens';
import { expectNextToken } from './utils';
import {
    UnexpectedTokenException,
    ValidationException
} from './exceptions';


function register() {
    return {
        type: Arguments.REGISTER,
        types: [TokenTypes.REGISTER],
    };
}

function addr() {
    return {
        type: Arguments.ADDRESS,
        types: [TokenTypes.SECTION_IDENTIFIER],
    };
}

function byte() {
    return {
        type: Arguments.BYTE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xFF, 'Invalid byte value'],
    };
}

function nibble() {
    return {
        type: Arguments.NIBBLE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xF, 'Invalid 4-bit value'],
    };
}

function dt() {
    return {
        type: Arguments.DELAY_TIMER,
        types: [TokenTypes.DELAY_TIMER],
    };
}

function st() {
    return {
        type: Arguments.SOUND_TIMER,
        types: [TokenTypes.SOUND_TIMER],
    };
}

function k() {
    return {
        type: Arguments.K,
        types: [TokenTypes.K],
    };
}

function i() {
    return {
        type: Arguments.I,
        types: [TokenTypes.I],
    };
}

function f() {
    return {
        type: Arguments.F,
        types: [TokenTypes.F],
    };
}

function b() {
    return {
        type: Arguments.B,
        types: [TokenTypes.B],
    };
}

class ArgsParser {
    constructor(argDefinitions) {
        this.argDefinitions = argDefinitions;
    }

    parse(tokens) {
        const args = [];
        if (this.argDefinitions.length == 0)
            return args;

        const argToken = tokens.next();
        for(const argDefinition of this.argDefinitions) {
            if (argDefinition.types.includes(argToken.type)) {
                const value = argToken.value;
                if (argDefinition.validator) {
                    const [result, err] = argDefinition.validator(value);
                    if (!result)
                        throw new ValidationException(err, argToken);
                }

                args.push({
                    type: argDefinition.type,
                    token: argToken,
                });
                if (argDefinition.nextArgument) {
                    tokens.skip(TokenTypes.WS);
                    expectNextToken(tokens, TokenTypes.COMMA);
                    tokens.skip(TokenTypes.WS);

                    return args.concat(argDefinition.nextArgument.parse(tokens));
                } else {
                    return args;
                }
            }
        }

        const allArgTypes = this.argDefinitions.reduce((types, definition) => {
            for(const type of definition.types) {
                types.add(type);
            }

            return types;
        }, new Set());

        throw new UnexpectedTokenException(argToken, tokens.context(), allArgTypes);
    }

    static arg(argDefinition) {
        return ArgsParser.builder()
            .addArg(argDefinition)
            .build();
    }

    static noArgs() {
        return new ArgsParser([]);
    }

    static builder() {
        return new ArgsParserBuilder();
    }
}

class ArgsParserBuilder {
    constructor() {
        this.argDefinitions = [];
    }

    addArgTypes(argType, tokenTypes, nextArgument) {
        this.argDefinitions.push({
            type: argType,
            types: tokenTypes,
            nextArgument: nextArgument
        });
        return this;
    }

    addArg(argDefinition, nextArgument) {
        this.argDefinitions.push({
            type: argDefinition.type,
            types: argDefinition.types,
            validator: argDefinition.validator,
            nextArgument
        });
        return this;
    }

    addValidatedArgTypes(argType, tokenTypes, validator, nextArgument) {
        this.argDefinitions.push({
            type: argType,
            types: tokenTypes,
            validator: validator,
            nextArgument: nextArgument
        });
        return this;
    }

    build() {
        return new ArgsParser(this.argDefinitions);
    }
}


export default ArgsParser;
export {
    register,
    addr,
    byte,
    nibble,
    dt,
    st,
    k,
    i,
    f,
    b,
};