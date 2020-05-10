import { TokenTypes, LineTypes } from '../constants';
import { expectNextToken } from './utils';
import { UnknownInstructionException } from './exceptions';


class InstructionParser {
    constructor(instructionDefinitions) {
        this.instructionDefinitions = instructionDefinitions;
    }

    parse(tokens, definitions) {
        const mnemonicToken = expectNextToken(tokens, TokenTypes.MNEMONIC);
        const mnemonic = mnemonicToken.value;

        if (mnemonic in this.instructionDefinitions) {
            tokens.skip(TokenTypes.WS);
            return {
                mnemonic,
                type: LineTypes.INSTRUCTION,
                token: mnemonicToken,
                operands: this.instructionDefinitions[mnemonic].parse(tokens, definitions)
            };
        }

        throw new UnknownInstructionException(mnemonicToken);
    }

    static builder() {
        return new InstructionParserBuilder();
    }
}

class InstructionParserBuilder {
    constructor() {
        this.instructionDefinitions = {};
    }

    addInstruction(mnemonic, operandsParser) {
        this.instructionDefinitions[mnemonic] = operandsParser;
        return this;
    }

    build() {
        return new InstructionParser(this.instructionDefinitions);
    }
}


export {
    InstructionParser,
};