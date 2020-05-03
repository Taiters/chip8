import { TokenTypes } from '../tokens';
import { expectNextToken } from './utils';
import { UnknownInstructionException } from './exceptions';


class InstructionParser {
    constructor(instructionDefinitions) {
        this.instructionDefinitions = instructionDefinitions;
    }

    parse(tokens) {
        const instructionToken = expectNextToken(tokens, TokenTypes.INSTRUCTION);
        const instruction = instructionToken.value;

        if (instruction in this.instructionDefinitions) {
            tokens.skip(TokenTypes.WS);
            return {
                instruction,
                args: this.instructionDefinitions[instruction].parse(tokens)
            };
        }

        throw new UnknownInstructionException(instructionToken);
    }

    static builder() {
        return new InstructionParserBuilder();
    }
}

class InstructionParserBuilder {
    constructor() {
        this.instructionDefinitions = {};
    }

    addInstruction(instruction, argsParser) {
        this.instructionDefinitions[instruction] = argsParser;
        return this;
    }

    build() {
        return new InstructionParser(this.instructionDefinitions);
    }
}


export default InstructionParser;