import {
    LineTypes,
    Mnemonics,
    Operands,
} from '../constants';
import { DataAssembler } from './data';
import {
    InstructionAssembler,
    InstructionModes,
    ModeAssemblers,
} from './instruction';
import { ProgramAssembler } from './program';


const assembler = ProgramAssembler.builder()
    .addAssembler(LineTypes.INSTRUCTION, InstructionAssembler.builder()
        .withInstruction(Mnemonics.CLS, i => i.value(0x00E0))
        .withInstruction(Mnemonics.RET, i => i.value(0x00EE))
        .withInstruction(Mnemonics.CALL, i => i
            .addMode(InstructionModes.NNN(0x2000)))
        .withInstruction(Mnemonics.JP, i => i
            .addMode(InstructionModes.NNN(0x1000))
            .addMode(m => m
                .addOperand(Operands.REGISTER)
                .addOperand(Operands.ADDRESS)
                .withAssembler(ModeAssemblers.NNN(0xB000))))
        .withInstruction(Mnemonics.SE, i => i
            .addMode(InstructionModes.XKK(0x3000))
            .addMode(InstructionModes.XY(0x5000)))
        .withInstruction(Mnemonics.SNE, i => i
            .addMode(InstructionModes.XKK(0x4000))
            .addMode(InstructionModes.XY(0x9000)))
        .withInstruction(Mnemonics.LD, i => i
            .addMode(InstructionModes.XKK(0x6000))
            .addMode(InstructionModes.XY(0x8000))
            .addMode(m => m
                .addOperand(Operands.I)
                .addOperand(Operands.ADDRESS)
                .withAssembler(ModeAssemblers.NNN(0xA000)))
            .addMode(m => m
                .addOperand(Operands.REGISTER)
                .addOperand(Operands.DELAY_TIMER)
                .withAssembler(ModeAssemblers.X(0xF007)))
            .addMode(m => m
                .addOperand(Operands.REGISTER)
                .addOperand(Operands.K)
                .withAssembler(ModeAssemblers.X(0xF00A)))
            .addMode(m => m
                .addOperand(Operands.DELAY_TIMER)
                .addOperand(Operands.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF015)))
            .addMode(m => m
                .addOperand(Operands.SOUND_TIMER)
                .addOperand(Operands.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF018)))
            .addMode(m => m
                .addOperand(Operands.F)
                .addOperand(Operands.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF029)))
            .addMode(m => m
                .addOperand(Operands.B)
                .addOperand(Operands.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF033)))
            .addMode(m => m
                .addOperand(Operands.I)
                .addOperand(Operands.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF055)))
            .addMode(m => m
                .addOperand(Operands.REGISTER)
                .addOperand(Operands.I)
                .withAssembler(ModeAssemblers.X(0xF065))))
        .withInstruction(Mnemonics.ADD, i => i
            .addMode(InstructionModes.XKK(0x7000))
            .addMode(InstructionModes.XY(0x8004))
            .addMode(m => m
                .addOperand(Operands.I)
                .addOperand(Operands.REGISTER)
                .withAssembler(ModeAssemblers.X(0xF01E))))
        .withInstruction(Mnemonics.OR, i => i
            .addMode(InstructionModes.XY(0x8001)))
        .withInstruction(Mnemonics.AND, i => i
            .addMode(InstructionModes.XY(0x8002)))
        .withInstruction(Mnemonics.XOR, i => i
            .addMode(InstructionModes.XY(0x8003)))
        .withInstruction(Mnemonics.SUB, i => i
            .addMode(InstructionModes.XY(0x8005)))
        .withInstruction(Mnemonics.SHR, i => i
            .addMode(InstructionModes.XY(0x8006)))
        .withInstruction(Mnemonics.SUBN, i => i
            .addMode(InstructionModes.XY(0x8007)))
        .withInstruction(Mnemonics.SHL, i => i
            .addMode(InstructionModes.XY(0x800E)))
        .withInstruction(Mnemonics.RND, i => i
            .addMode(InstructionModes.XKK(0xC000)))
        .withInstruction(Mnemonics.DRW, i => i
            .addMode(InstructionModes.XYN(0xD000)))
        .withInstruction(Mnemonics.SKP, i => i
            .addMode(InstructionModes.X(0xE09E)))
        .withInstruction(Mnemonics.SKNP, i => i
            .addMode(InstructionModes.X(0xE0A1)))
        .build())
    .addAssembler(LineTypes.DATA, new DataAssembler())
    .build();


export default assembler;
