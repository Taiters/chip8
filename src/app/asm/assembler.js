import {
    Instructions,
    Arguments,
    Sections,
} from './constants';
import InstructionAssembler, {
    addrAssembler,
    registerAssembler,
    nnn,
    xkk,
    xy,
} from './assemblers/instruction';


const BYTES_PER_LINE = {};
BYTES_PER_LINE[Sections.INSTRUCTIONS] = 2;
BYTES_PER_LINE[Sections.DATA] = 1;

const instructionAssembler = InstructionAssembler.builder()
    .add(i => i.withInstruction(Instructions.CLS)
        .withAssembler(() => 0x00E0))
    .add(i => i.withInstruction(Instructions.RET)
        .withAssembler(() => 0x00EE))
    .add(i => nnn(0x1000, i.withInstruction(Instructions.JP)))
    .add(i => nnn(0x2000, i.withInstruction(Instructions.CALL)))
    .add(i => xkk(0x3000, i.withInstruction(Instructions.SE)))
    .add(i => xkk(0x4000, i.withInstruction(Instructions.SNE)))
    .add(i => xy(0x5000, i.withInstruction(Instructions.SE)))
    .add(i => xkk(0x6000, i.withInstruction(Instructions.LD)))
    .add(i => xkk(0x7000, i.withInstruction(Instructions.ADD)))
    .add(i => xy(0x8000, i.withInstruction(Instructions.LD)))
    .add(i => xy(0x8001, i.withInstruction(Instructions.OR)))
    .add(i => xy(0x8002, i.withInstruction(Instructions.AND)))
    .add(i => xy(0x8003, i.withInstruction(Instructions.XOR)))
    .add(i => xy(0x8004, i.withInstruction(Instructions.ADD)))
    .add(i => xy(0x8005, i.withInstruction(Instructions.SUB)))
    .add(i => xy(0x8006, i.withInstruction(Instructions.SHR)))
    .add(i => xy(0x8007, i.withInstruction(Instructions.SUBN)))
    .add(i => xy(0x800E, i.withInstruction(Instructions.SHL)))
    .add(i => xy(0x9000, i.withInstruction(Instructions.SNE)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.I, Arguments.ADDRESS)
        .withAssembler(addrAssembler(0xA000, 1)))
    .add(i => i.withInstruction(Instructions.JP)
        .withArgs(Arguments.REGISTER, Arguments.ADDRESS)
        .withAssembler(addrAssembler(0xB000, 1)))
    .add(i => xkk(0xC000, i.withInstruction(Instructions.RND)))
    .add(i => i.withInstruction(Instructions.DRW)
        .withArgs(Arguments.REGISTER, Arguments.REGISTER, Arguments.NIBBLE)
        .withAssembler((instruction) => {
            const x = instruction.args[0].token.value;
            const y = instruction.args[1].token.value;
            const n = instruction.args[2].token.value;

            return 0xD000 | (x << 8) | (y << 4) | n;
        }))
    .add(i => i.withInstruction(Instructions.SKP)
        .withArgs(Arguments.REGISTER)
        .withAssembler(registerAssembler(0xE09E)))
    .add(i => i.withInstruction(Instructions.SKNP)
        .withArgs(Arguments.REGISTER)
        .withAssembler(registerAssembler(0xE0A1)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.REGISTER, Arguments.DELAY_TIMER)
        .withAssembler(registerAssembler(0xF007)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.REGISTER, Arguments.K)
        .withAssembler(registerAssembler(0xF00A)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.REGISTER, Arguments.K)
        .withAssembler(registerAssembler(0xF00A)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.DELAY_TIMER, Arguments.REGISTER)
        .withAssembler(registerAssembler(0xF015, 1)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.SOUND_TIMER, Arguments.REGISTER)
        .withAssembler(registerAssembler(0xF018, 1)))
    .add(i => i.withInstruction(Instructions.ADD)
        .withArgs(Arguments.I, Arguments.REGISTER)
        .withAssembler(registerAssembler(0xF01E, 1)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.F, Arguments.REGISTER)
        .withAssembler(registerAssembler(0xF029, 1)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.B, Arguments.REGISTER)
        .withAssembler(registerAssembler(0xF033, 1)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.I, Arguments.REGISTER)
        .withAssembler(registerAssembler(0xF055, 1)))
    .add(i => i.withInstruction(Instructions.LD)
        .withArgs(Arguments.REGISTER, Arguments.I)
        .withAssembler(registerAssembler(0xF065)))
    .build();

function generateAddressLookup(program) {
    let address = 0x200;
    const lookup = {};

    for (const section of program.sections) {
        if (section.name) {
            lookup[section.name] = address;
        }

        address += section.lines.length * BYTES_PER_LINE[section.type];
    }

    return lookup;
}

function debugLine(address, value, section) {
    const a = address.toString(16).padStart(4, '0');
    const v = value.toString(16).padStart(2, '0');
    const s = section ? ` <- ${section}` : '';

    return `0x${a}: 0x${v}${s}`;
}

function assemble(program) {
    const addressLookup = generateAddressLookup(program);
    let address = 0x200;
    for (const section of program.sections) {
        let newSection = true;
        if (section.type === Sections.INSTRUCTIONS) {
            for (const instruction of section.lines) {
                const opcode = instructionAssembler.assemble(instruction, addressLookup);
                console.log(debugLine(address, opcode >> 8, newSection ? section.name : null)); // eslint-disable-line no-console
                console.log(debugLine(address + 1, opcode & 0xFF)); // eslint-disable-line no-console

                address += 2;
                newSection = false;
            }
        } else {
            for (const data of section.lines) {
                console.log(debugLine(address, data.value, newSection ? section.name : null)); // eslint-disable-line no-console

                address += 1;
                newSection = false;
            }
        }
    }
}


export default assemble;