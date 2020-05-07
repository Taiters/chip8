import {
    Arguments
} from '../constants';
import {
    SectionNotFoundException,
    UnknownInstructionException,
} from './exceptions';


class InstructionAssembler {
    constructor(instructionModes) {
        this.instructionModes = instructionModes;
    }

    assemble(instruction, lookup) {
        const key = [instruction.instruction, ...instruction.args.map(a => a.type)].join('_');
        const mode = this.instructionModes[key];

        if (!mode) {
            throw new UnknownInstructionException(instruction.token);
        }

        const assembled = mode.assemble(instruction, lookup);

        return assembled;
    }

    static builder() {
        return new InstructionAssemblerBuilder();
    }
}

class InstructionAssemblerBuilder {
    constructor() {
        this.instructionModes = {};
    }

    withInstruction(instruction, builderCallback) {
        const builder = new InstructionBuilder();
        builderCallback(builder);

        for (const mode of builder.build()) {
            const key = [instruction, ...mode.expectedArgs].join('_');
            this.instructionModes[key] = mode;
        }

        return this;
    }

    build() {
        return new InstructionAssembler(this.instructionModes);
    }
}


class InstructionBuilder {
    constructor() {
        this.modes = [];
    }

    addMode(builderCallback) {
        const builder = new InstructionModeBuilder();
        builderCallback(builder);

        this.modes.push(builder.build());

        return this;
    }

    value(val) {
        return this.addMode(m => m.value(val));
    }

    build() {
        return this.modes;
    }
}

class InstructionModeBuilder {
    constructor() {
        this.expectedArgs = [];
    }

    addArg(arg) {
        this.expectedArgs.push(arg);
        return this;
    }

    withAssembler(assemblerFunc) {
        this.assemble = assemblerFunc;
        return this;
    }

    value(val) {
        return this.withAssembler(() => val);
    }

    build() {
        return {
            expectedArgs: this.expectedArgs,
            assemble: this.assemble,
        };
    }
}

const ModeAssemblers = {
    NNN: (mask) => (instruction, lookup) => {
        const addressName = instruction.args.find(a => a.type == Arguments.ADDRESS);
        const address = lookup[addressName.token.value];

        if (!address)
            throw new SectionNotFoundException(addressName.token);
        
        return mask | address;
    },
    XYN: (mask) => (instruction) => {
        const x = instruction.args[0].token.value;
        const y = instruction.args[1].token.value;
        const n = instruction.args[2].token.value;

        return mask | (x << 8) | (y << 4) | n;
    },
    XKK: (mask) => (instruction) => {
        const x = instruction.args[0].token.value;
        const kk = instruction.args[1].token.value;

        return mask | (x << 8) | kk;
    },
    XY: (mask) => (instruction) => {
        const x = instruction.args[0].token.value;
        const y = instruction.args[1].token.value;

        return mask | (x << 8) | (y << 4);
    },
    X: (mask) => (instruction) => {
        const x = instruction.args.find(a => a.type === Arguments.REGISTER);

        return mask | (x.token.value << 8);
    },
};

const InstructionModes = {
    NNN: (mask) => (builder) => builder
        .addArg(Arguments.ADDRESS)
        .withAssembler(ModeAssemblers.NNN(mask)),
    XYN: (mask) => (builder) => builder
        .addArg(Arguments.REGISTER)
        .addArg(Arguments.REGISTER)
        .addArg(Arguments.NIBBLE)
        .withAssembler(ModeAssemblers.XYN(mask)),
    XKK: (mask) => (builder) => builder
        .addArg(Arguments.REGISTER)
        .addArg(Arguments.BYTE)
        .withAssembler(ModeAssemblers.XKK(mask)),
    XY: (mask) => (builder) => builder
        .addArg(Arguments.REGISTER)
        .addArg(Arguments.REGISTER)
        .withAssembler(ModeAssemblers.XY(mask)),
    X: (mask) => (builder) => builder
        .addArg(Arguments.REGISTER)
        .withAssembler(ModeAssemblers.X(mask)),
};


export {
    InstructionAssembler,
    InstructionModes,
    ModeAssemblers,
};