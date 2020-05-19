import {
    Operands
} from '../constants';
import {
    LabelNotFoundException,
    UnknownInstructionException,
} from './exceptions';


class InstructionAssembler {
    constructor(instructionModes) {
        this.instructionModes = instructionModes;
    }

    assemble(instruction, lookup) {
        const key = [instruction.mnemonic, ...instruction.operands.map(a => a.type)].join('_');
        const mode = this.instructionModes[key];

        if (!mode) {
            throw new UnknownInstructionException(instruction.token);
        }

        return mode.assemble(instruction, lookup);
    }

    static builder() {
        return new InstructionAssemblerBuilder();
    }
}

class InstructionAssemblerBuilder {
    constructor() {
        this.instructionModes = {};
    }

    withInstruction(mnemonic, builderCallback) {
        const builder = new InstructionBuilder();
        builderCallback(builder);

        for (const mode of builder.build()) {
            const key = [mnemonic, ...mode.expectedOperands].join('_');
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
        this.expectedOperands = [];
    }

    addOperand(operand) {
        this.expectedOperands.push(operand);
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
            expectedOperands: this.expectedOperands,
            assemble: this.assemble,
        };
    }
}

const ModeAssemblers = {
    NNN: (mask) => (instruction, lookup) => {
        const addressOperand = instruction.operands.find(a => a.type == Operands.ADDRESS);
        const address = lookup[addressOperand.value.identifier];

        if (!address)
            throw new LabelNotFoundException(addressOperand.token);
        
        return mask | (address + addressOperand.value.offset);
    },
    XYN: (mask) => (instruction) => {
        const x = instruction.operands[0].value;
        const y = instruction.operands[1].value;
        const n = instruction.operands[2].value;

        return mask | (x << 8) | (y << 4) | n;
    },
    XKK: (mask) => (instruction) => {
        const x = instruction.operands[0].value;
        const kk = instruction.operands[1].value;

        return mask | (x << 8) | kk;
    },
    XY: (mask) => (instruction) => {
        const x = instruction.operands[0].value;
        const y = instruction.operands[1].value;

        return mask | (x << 8) | (y << 4);
    },
    X: (mask) => (instruction) => {
        const x = instruction.operands.find(a => a.type === Operands.REGISTER);

        return mask | (x.value << 8);
    },
};

const InstructionModes = {
    NNN: (mask) => (builder) => builder
        .addOperand(Operands.ADDRESS)
        .withAssembler(ModeAssemblers.NNN(mask)),
    XYN: (mask) => (builder) => builder
        .addOperand(Operands.REGISTER)
        .addOperand(Operands.REGISTER)
        .addOperand(Operands.NIBBLE)
        .withAssembler(ModeAssemblers.XYN(mask)),
    XKK: (mask) => (builder) => builder
        .addOperand(Operands.REGISTER)
        .addOperand(Operands.BYTE)
        .withAssembler(ModeAssemblers.XKK(mask)),
    XY: (mask) => (builder) => builder
        .addOperand(Operands.REGISTER)
        .addOperand(Operands.REGISTER)
        .withAssembler(ModeAssemblers.XY(mask)),
    X: (mask) => (builder) => builder
        .addOperand(Operands.REGISTER)
        .withAssembler(ModeAssemblers.X(mask)),
};


export {
    InstructionAssembler,
    InstructionModes,
    ModeAssemblers,
};