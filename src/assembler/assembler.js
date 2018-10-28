import getOpcode from 'chip8/assembler/instructions.js';


const buildAddressMap = (ast) => {
    const addrMap = {};
    var currentAddr = 0x200;
    for (var section of ast.sections) {
        if (section.label != null) {
            addrMap[section.label] = currentAddr;
        }

        currentAddr += section.instructions.length * 2;
    }

    return addrMap;
};

const mapInstructionLabels = (instruction, addrMap) => {
    const args = [];
    for (var arg of instruction.args) {
        if (arg.type == 'label') {
            args.push({
                type: 'address',
                value: addrMap[arg.value]
            });
        } else {
            args.push(arg);
        }
    }

    return {
        operation: instruction.operation,
        args: args
    }
};

const normalizeAst = (ast) => {
    const addrMap = buildAddressMap(ast);
    const instructions = [];

    for (var section of ast.sections) {
        for (var instruction of section.instructions) {
            instructions.push(mapInstructionLabels(instruction, addrMap));
        }
    }

    return instructions;
}

const buildUint8Array = (opcodes) => {
    const length = opcodes.length * 2;
    const arr = new Uint8Array(length);
    var offset = 0;
    for (var opcode of opcodes) {
        const b1 = (opcode & 0xFF00) >> 8
        const b2 = opcode & 0xFF;
        arr[offset] = b1;
        arr[offset + 1] = b2;

        offset += 2;
    }

    return arr;
};

const assemble = (ast) => {
    const normalizedInstructions = normalizeAst(ast);
    const opcodes = normalizedInstructions.map(getOpcode);

    return buildUint8Array(opcodes);
};

export default {
    buildAddressMap,
    mapInstructionLabels,
    assemble
};
