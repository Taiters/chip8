import { ProgramParser } from './program';
import { SectionParser } from './section';
import { InstructionParser } from './instruction';
import { DataParser } from './data';
import { OperandsParser, OperandDefinitions } from './operands';
import {
    Sections,
    TokenTypes,
    Mnemonics,
    Operands,
} from '../constants';


const parser = new ProgramParser(SectionParser.builder()
    .addSection(Sections.INSTRUCTIONS, [TokenTypes.MNEMONIC], InstructionParser.builder()

        // CLS - 00E0
        .addInstruction(Mnemonics.CLS, OperandsParser.noArgs())

        // RET - 00EE
        .addInstruction(Mnemonics.RET, OperandsParser.noArgs())

        // JP - 1nnn, Bnnn
        .addInstruction(Mnemonics.JP, OperandsParser.builder()
            .addOperand(OperandDefinitions.ADDRESS)
            .addOperand({
                type: Operands.REGISTER,
                types: [TokenTypes.REGISTER],
                validator: (value) => [value === 0, 'Only v0 is valid in this context (JP v0, addr)']
            }, OperandsParser.arg(OperandDefinitions.ADDRESS))
            .build())
        
        // CALL - 2nnn
        .addInstruction(Mnemonics.CALL, OperandsParser.arg(OperandDefinitions.ADDRESS))

        // SE - 3xkk, 5xy0
        .addInstruction(Mnemonics.SE, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.builder()
                .addOperand(OperandDefinitions.BYTE)
                .addOperand(OperandDefinitions.REGISTER)
                .build())
            .build())

        // SNE - 4xkk, 9xy0
        .addInstruction(Mnemonics.SNE, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.builder()
                .addOperand(OperandDefinitions.BYTE)
                .addOperand(OperandDefinitions.REGISTER)
                .build())
            .build())

        // LD - 6xkk, 8xy0, Annn, Fx07, Fx0A, Fx15, Fx18, Fx29, Fx33, Fx55, Fx65
        .addInstruction(Mnemonics.LD, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.builder()
                .addOperand(OperandDefinitions.BYTE)
                .addOperand(OperandDefinitions.REGISTER)
                .addOperand(OperandDefinitions.DELAY_TIMER)
                .addOperand(OperandDefinitions.KEY)
                .addOperand(OperandDefinitions.I)
                .build())
            .addOperand(OperandDefinitions.I, OperandsParser.builder()
                .addOperand(OperandDefinitions.ADDRESS)
                .addOperand(OperandDefinitions.REGISTER)
                .build())
            .addOperand(OperandDefinitions.DELAY_TIMER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .addOperand(OperandDefinitions.SOUND_TIMER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .addOperand(OperandDefinitions.FONT, OperandsParser.arg(OperandDefinitions.REGISTER))
            .addOperand(OperandDefinitions.B, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())
        
        // ADD - 7xkk, 8xy4, Fx1E
        .addInstruction(Mnemonics.ADD, OperandsParser.builder()
            .addOperand(OperandDefinitions.I, OperandsParser.arg(OperandDefinitions.REGISTER))
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.builder()
                .addOperand(OperandDefinitions.REGISTER)
                .addOperand(OperandDefinitions.BYTE)
                .build())
            .build())

        // OR - 8xy1
        .addInstruction(Mnemonics.OR, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())
        
        // AND - 8xy2
        .addInstruction(Mnemonics.AND, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())

        // XOR - 8xy3
        .addInstruction(Mnemonics.XOR, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())

        // SUB - 8xy5
        .addInstruction(Mnemonics.SUB, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())
        
        // SHR - 8xy6
        .addInstruction(Mnemonics.SHR, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())

        // SUBN - 8xy7
        .addInstruction(Mnemonics.SUBN, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())

        // SHL - 8xyE
        .addInstruction(Mnemonics.SHL, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.REGISTER))
            .build())

        // RND - Cxkk
        .addInstruction(Mnemonics.RND, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.BYTE))
            .build())
        
        // DRW - Dxyn
        .addInstruction(Mnemonics.DRW, OperandsParser.builder()
            .addOperand(OperandDefinitions.REGISTER, OperandsParser.builder()
                .addOperand(OperandDefinitions.REGISTER, OperandsParser.arg(OperandDefinitions.NIBBLE))
                .build())
            .build())
        
        // SKP - Ex9E
        .addInstruction(Mnemonics.SKP, OperandsParser.arg(OperandDefinitions.REGISTER))

        // SKNP - ExA1
        .addInstruction(Mnemonics.SKNP, OperandsParser.arg(OperandDefinitions.REGISTER))

        .build())
    
    .addSection(Sections.DATA, [
        TokenTypes.BIN,
        TokenTypes.HEX,
        TokenTypes.DEC,
    ], new DataParser())
    .build());


export default parser;