import { TokenTypes } from '../constants';
import { expectNextToken } from './utils';
import { UnknownInstructionException } from './exceptions';


class InstructionParser {
    constructor(instructionDefinitions) {
        this.instructionDefinitions = instructionDefinitions;
    }

    parse(tokens) {
        const mnemonicToken = expectNextToken(tokens, TokenTypes.MNEMONIC);
        const mnemonic = mnemonicToken.value;

        if (mnemonic in this.instructionDefinitions) {
            tokens.skip(TokenTypes.WS);
            return {
                mnemonic,
                token: mnemonicToken,
                operands: this.instructionDefinitions[mnemonic].parse(tokens)
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

    addInstruction(mnemonic, argsParser) {
        this.instructionDefinitions[mnemonic] = argsParser;
        return this;
    }

    build() {
        return new InstructionParser(this.instructionDefinitions);
    }
}


export {
    InstructionParser,
};