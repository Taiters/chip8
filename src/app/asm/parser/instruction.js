import { LineTypes, TokenTypes } from '../constants';
import { UnknownInstructionException } from './exceptions';
import { expectNextToken } from './utils';


class InstructionParser {
    constructor(instructionDefinitions) {
        this.instructionDefinitions = instructionDefinitions;
    }

    parse(tokens, definitions) {
        const mnemonicToken = expectNextToken(tokens, TokenTypes.MNEMONIC);
        const mnemonic = mnemonicToken.value;

        if (mnemonic in this.instructionDefinitions) {
            tokens.skip(TokenTypes.WS);
            try {
                return {
                    mnemonic,
                    type: LineTypes.INSTRUCTION,
                    token: mnemonicToken,
                    operands: this.instructionDefinitions[mnemonic].parse(tokens, definitions)
                };
            } catch (err) {
            }
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
    InstructionParser
};
