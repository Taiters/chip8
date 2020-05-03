import { TokenTypes } from '../tokens';
import { expectNextToken } from './utils';
import {
    UnexpectedTokenException,
    ValidationException
} from './exceptions';


function register() {
    return {
        types: [TokenTypes.REGISTER],
    };
}

function addr() {
    return {
        types: [TokenTypes.SECTION_IDENTIFIER],
    };
}

function byte() {
    return {
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
        types: [TokenTypes.DELAY_TIMER]
    };
}

function st() {
    return {
        types: [TokenTypes.SOUND_TIMER]
    };
}

function k() {
    return {
        types: [TokenTypes.K]
    };
}

function i() {
    return {
        types: [TokenTypes.I]
    };
}

function f() {
    return {
        types: [TokenTypes.F]
    };
}

function b() {
    return {
        types: [TokenTypes.B]
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

                args.push(argToken.value);
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

    addArgTypes(argTypes, nextArgument) {
        this.argDefinitions.push({
            types: argTypes,
            nextArgument: nextArgument
        });
        return this;
    }

    addArg(argDefinition, nextArgument) {
        this.argDefinitions.push({
            types: argDefinition.types,
            validator: argDefinition.validator,
            nextArgument
        });
        return this;
    }

    addValidatedArgTypes(argTypes, validator, nextArgument) {
        this.argDefinitions.push({
            types: argTypes,
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