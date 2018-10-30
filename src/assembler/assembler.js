import getOpcode from 'chip8/assembler/instructions.js';


const getSectionsByType = (ast, type) => ast.sections.filter(section => section.type == type);

const buildAddressMap = (instructions, data) => {
    const addrMap = {};
    var currentAddr = 0x200;

    for (var section of instructions) {
        if (section.label != null) {
            addrMap[section.label] = currentAddr;
        }

        currentAddr += section.instructions.length * 2;
    }

    for (var section of data) {
        addrMap[section.label] = currentAddr;
        currentAddr += section.data.length;
    }

    return addrMap;
};

const mapInstructionLabelsToAddress = (instruction, addrMap) => {
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

const normalizeInstructions = (instructions, addrMap) => {
    const normalizedInstructions = [];

    for (var section of instructions) {
        for (var instruction of section.instructions) {
            normalizedInstructions.push(mapInstructionLabelsToAddress(instruction, addrMap));
        }
    }

    return normalizedInstructions;
}

const buildUint8Array = (opcodes, data) => {
    const length = (opcodes.length * 2) + data.length;
    const arr = new Uint8Array(length);
    var offset = 0;
    for (var opcode of opcodes) {
        const b1 = (opcode & 0xFF00) >> 8
        const b2 = opcode & 0xFF;
        arr[offset] = b1;
        arr[offset + 1] = b2;

        offset += 2;
    }

    for (var value of data) {
        arr[offset] = value & 0xFF;
        offset += 1;
    }

    return arr;
};

const assemble = (ast) => {
    const instructions = getSectionsByType(ast, 'instructions');
    const data = getSectionsByType(ast, 'data');
    const addrMap = buildAddressMap(instructions, data);
    const normalizedInstructions = normalizeInstructions(instructions, addrMap);
    const instructionOpcodes = normalizedInstructions.map(getOpcode);
    const flattenedData = [];

    for (var section of data) {
        flattenedData.push(...section.data);
    }

    return buildUint8Array(instructionOpcodes, flattenedData);
};

export default {
    buildAddressMap,
    mapInstructionLabelsToAddress,
    assemble
};
