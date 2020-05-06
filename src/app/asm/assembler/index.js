import {
    Arguments,
    Instructions,
    Sections,
} from '../constants';
import {
    InstructionAssembler,
    InstructionModes,
    ModeAssemblers,
} from './instruction';
import ProgramAssembler from './program';
import SectionAssembler from './section';
import DataAssembler from './data';


const assembler = new ProgramAssembler(SectionAssembler.builder()
    .addAssembler(Sections.INSTRUCTIONS, InstructionAssembler.builder()
        .withInstruction(Instructions.CLS, i => i.value(0x00E0))
        .withInstruction(Instructions.RET, i => i.value(0x00EE))
        .withInstruction(Instructions.CALL, i => i
            .addMode(InstructionModes.NNN(0x2000)))
        .withInstruction(Instructions.JP, i => i
            .addMode(InstructionModes.NNN(0x1000))
            .addMode(m => m
                .addArg(Arguments.REGISTER)
                .addArg(Arguments.ADDRESS)
                .withAssembler(ModeAssemblers.NNN(0xB000))))
        .withInstruction(Instructions.SE, i => i
            .addMode(InstructionModes.XKK(0x3000))
            .addMode(InstructionModes.XY(0x5000)))
        .withInstruction(Instructions.SNE, i => i
            .addMode(InstructionModes.XKK(0x4000))
            .addMode(InstructionModes.XY(0x9000)))
        .withInstruction(Instructions.LD, i => i
            .addMode(InstructionModes.XKK(0x6000))
            .addMode(InstructionModes.XY(0x8000))
            .addMode(m => m
                .addArg(Arguments.I)
                .addArg(Arguments.ADDRESS)
                .withAssembler(ModeAssemblers.NNN(0xA000)))
            .addMode(m => m
                .addArg(Arguments.REGISTER)
                .addArg(Arguments.DELAY_TIMER)
                .withAssembler(ModeAssemblers.X(0xF007)))
            .addMode(m => m
                .addArg(Arguments.REGISTER)
                .addArg(Arguments.K)
                .withAssembler(ModeAssemblers.X(0xF00A)))
            .addMode(m => m
                .addArg(Arguments.DELAY_TIMER)
                .addArg(Arguments.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF015)))
            .addMode(m => m
                .addArg(Arguments.SOUND_TIMER)
                .addArg(Arguments.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF018)))
            .addMode(m => m
                .addArg(Arguments.F)
                .addArg(Arguments.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF029)))
            .addMode(m => m
                .addArg(Arguments.B)
                .addArg(Arguments.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF033)))
            .addMode(m => m
                .addArg(Arguments.I)
                .addArg(Arguments.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF055)))
            .addMode(m => m
                .addArg(Arguments.REGISTER)
                .addArg(Arguments.I)
                .withAssembler(ModeAssemblers.X(0xF065))))
        .withInstruction(Instructions.ADD, i => i
            .addMode(InstructionModes.XKK(0x7000))
            .addMode(InstructionModes.XY(0x8004))
            .addMode(m => m
                .addArg(Arguments.I)
                .addArg(Arguments.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF01E))))
        .withInstruction(Instructions.OR, i => i
            .addMode(InstructionModes.XY(0x8001)))
        .withInstruction(Instructions.AND, i => i
            .addMode(InstructionModes.XY(0x8002)))
        .withInstruction(Instructions.XOR, i => i
            .addMode(InstructionModes.XY(0x8003)))
        .withInstruction(Instructions.SUB, i => i
            .addMode(InstructionModes.XY(0x8005)))
        .withInstruction(Instructions.SHR, i => i
            .addMode(InstructionModes.XY(0x8006)))
        .withInstruction(Instructions.SUBN, i => i
            .addMode(InstructionModes.XY(0x8007)))
        .withInstruction(Instructions.SHL, i => i
            .addMode(InstructionModes.XY(0x800E)))
        .withInstruction(Instructions.RND, i => i
            .addMode(InstructionModes.XKK(0xC000)))
        .withInstruction(Instructions.DRW, i => i
            .addMode(InstructionModes.XYN(0xD000)))
        .withInstruction(Instructions.SKP, i => i
            .addMode(InstructionModes.X(0xE09E)))
        .withInstruction(Instructions.SKNP, i => i
            .addMode(InstructionModes.X(0xE0A1)))
        .build())
    .addAssembler(Sections.DATA, new DataAssembler())
    .build());


export default assembler;