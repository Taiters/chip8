import { expectNextToken } from './utils';
import {
    Arguments,
    TokenTypes
} from '../constants';
import {
    UnexpectedTokenException,
    ValidationException
} from './exceptions';


const ArgDefinitions = {
    REGISTER: {
        type: Arguments.REGISTER,
        types: [TokenTypes.REGISTER]
    },
    ADDRESS: {
        type: Arguments.ADDRESS,
        types: [TokenTypes.SECTION_IDENTIFIER]
    },
    BYTE: {
        type: Arguments.BYTE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xFF, 'Invalid byte value'],
    },
    NIBBLE: {
        type: Arguments.NIBBLE,
        types: [
            TokenTypes.HEX,
            TokenTypes.BIN,
            TokenTypes.DEC,
        ],
        validator: (value) => [0 <= value && value <= 0xF, 'Invalid 4 bit value'],
    },
    DELAY_TIMER: {
        type: Arguments.DELAY_TIMER,
        types: [TokenTypes.DELAY_TIMER],
    },
    SOUND_TIMER: {
        type: Arguments.SOUND_TIMER,
        types: [TokenTypes.SOUND_TIMER],
    },
    KEY: {
        type: Arguments.K,
        types: [TokenTypes.K],
    },
    FONT: {
        type: Arguments.F,
        types: [TokenTypes.F],
    },
    I: {
        type: Arguments.I,
        types: [TokenTypes.I],
    },
    B: {
        type: Arguments.B,
        types: [TokenTypes.B],
    }
};

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

    addArg(argDefinition, nextArgument) {
        this.argDefinitions.push({
            type: argDefinition.type,
            types: argDefinition.types,
            validator: argDefinition.validator,
            nextArgument
        });
        return this;
    }

    build() {
        return new ArgsParser(this.argDefinitions);
    }
}


export default ArgsParser;
export {
    ArgDefinitions
};