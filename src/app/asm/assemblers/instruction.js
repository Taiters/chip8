import { Arguments } from '../constants';
import {
    UnknownInstructionException,
    SectionNotFoundException
} from './exceptions';


const registerAssembler = (mask, argIndex) => (instruction) => {
    const register = instruction.args[argIndex || 0].token.value;

    return mask | (register << 8);
};

const addrAssembler = (mask, argIndex) => (instruction, lookup) => {
    const arg = instruction.args[argIndex || 0];
    const address = lookup[arg.token.value];

    if (!address)
        throw new SectionNotFoundException(arg.token.value, instruction);

    return mask | address;
};

const nnn = (mask, builder) => builder
    .withArgs(Arguments.ADDRESS)
    .withAssembler(addrAssembler(mask));

const xkk = (mask, builder) => builder
    .withArgs(Arguments.REGISTER, Arguments.BYTE)
    .withAssembler((instruction) => {
        const x = instruction.args[0].token.value;
        const kk = instruction.args[1].token.value;

        return mask | (x << 8) | kk;
    });

const xy = (mask, builder) => builder
    .withArgs(Arguments.REGISTER, Arguments.REGISTER)
    .withAssembler((instruction) => {
        const x = instruction.args[0].token.value;
        const y = instruction.args[1].token.value;

        return mask | (x << 8) | (y << 4);
    });

class InstructionAssembler {
    constructor(instructionAssemblers) {
        this.instructionAssemblers = instructionAssemblers;
    }

    getAssembler(instruction) {
        const argTypes = instruction.args.map((arg) => arg.type);
        const key = [instruction.instruction, ...argTypes].join('_');

        return this.instructionAssemblers[key];
    }

    assemble(instruction, lookup) {
        const assembler = this.getAssembler(instruction);
        if (!assembler)
            throw new UnknownInstructionException(instruction);
        
        return assembler(instruction, lookup);
    }

    static builder() {
        return new InstructionAssemblerBuilder();
    }
}

class InstructionAssemblerBuilder {
    constructor() {
        this.assemblers = [];
    }

    add(builderCallback) {
        const builder = new AssemblerBuilder();
        builderCallback(builder);

        this.assemblers.push(builder.build());
        return this;
    }

    build() {
        const assemblerMap = this.assemblers.reduce((map, assembler) => {
            map[assembler.key] = assembler.assemble;
            return map;
        }, {});

        return new InstructionAssembler(assemblerMap);
    }
}

class AssemblerBuilder {
    constructor() {
        this.argTypes = [];
    }

    withInstruction(instruction) {
        this.instruction = instruction;
        return this;
    }

    withArgs(...argTypes) {
        this.argTypes = argTypes;
        return this;
    }

    withAssembler(assembleFunc) {
        this.assembleFunc = assembleFunc;
        return this;
    }

    build() {
        return {
            key: [this.instruction, ...this.argTypes].join('_'),
            assemble: this.assembleFunc,
        };
    }
}


export default InstructionAssembler;
export {
    addrAssembler,
    registerAssembler,
    nnn,
    xkk,
    xy,
};