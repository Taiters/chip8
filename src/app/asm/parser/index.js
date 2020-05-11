import { ProgramParser } from './program';
import { InstructionParser } from './instruction';
import { DataParser } from './data';
import { OperandsParser, operand } from './operands';
import {
    TokenTypes,
    Mnemonics,
    Operands,
} from '../constants';


const parser = ProgramParser.builder()
    .addParser([TokenTypes.MNEMONIC], InstructionParser.builder()

        // CLS - 00E0
        .addInstruction(Mnemonics.CLS, OperandsParser.noArgs())

        // RET - 00EE
        .addInstruction(Mnemonics.RET, OperandsParser.noArgs())

        // JP - 1nnn, Bnnn
        .addInstruction(Mnemonics.JP, OperandsParser.builder()
            .addOperand(operand(Operands.ADDRESS))
            .addOperand({
                type: Operands.REGISTER,
                types: [TokenTypes.REGISTER],
                validator: (value) => [value === 0, 'Only v0 is valid in this context (JP v0, addr)']
            }, OperandsParser.arg(operand(Operands.ADDRESS)))
            .build())
        
        // CALL - 2nnn
        .addInstruction(Mnemonics.CALL, OperandsParser.arg(operand(Operands.ADDRESS)))

        // SE - 3xkk, 5xy0
        .addInstruction(Mnemonics.SE, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.builder()
                .addOperand(operand(Operands.BYTE))
                .addOperand(operand(Operands.REGISTER))
                .build())
            .build())

        // SNE - 4xkk, 9xy0
        .addInstruction(Mnemonics.SNE, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.builder()
                .addOperand(operand(Operands.BYTE))
                .addOperand(operand(Operands.REGISTER))
                .build())
            .build())

        // LD - 6xkk, 8xy0, Annn, Fx07, Fx0A, Fx15, Fx18, Fx29, Fx33, Fx55, Fx65
        .addInstruction(Mnemonics.LD, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.builder()
                .addOperand(operand(Operands.BYTE))
                .addOperand(operand(Operands.REGISTER))
                .addOperand(operand(Operands.DELAY_TIMER))
                .addOperand(operand(Operands.K))
                .addOperand(operand(Operands.I))
                .build())
            .addOperand(operand(Operands.I), OperandsParser.builder()
                .addOperand(operand(Operands.ADDRESS))
                .addOperand(operand(Operands.REGISTER))
                .build())
            .addOperand(operand(Operands.DELAY_TIMER), OperandsParser.arg(operand(Operands.REGISTER)))
            .addOperand(operand(Operands.SOUND_TIMER), OperandsParser.arg(operand(Operands.REGISTER)))
            .addOperand(operand(Operands.F), OperandsParser.arg(operand(Operands.REGISTER)))
            .addOperand(operand(Operands.B), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())
        
        // ADD - 7xkk, 8xy4, Fx1E
        .addInstruction(Mnemonics.ADD, OperandsParser.builder()
            .addOperand(operand(Operands.I), OperandsParser.arg(operand(Operands.REGISTER)))
            .addOperand(operand(Operands.REGISTER), OperandsParser.builder()
                .addOperand(operand(Operands.REGISTER))
                .addOperand(operand(Operands.BYTE))
                .build())
            .build())

        // OR - 8xy1
        .addInstruction(Mnemonics.OR, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())
        
        // AND - 8xy2
        .addInstruction(Mnemonics.AND, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())

        // XOR - 8xy3
        .addInstruction(Mnemonics.XOR, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())

        // SUB - 8xy5
        .addInstruction(Mnemonics.SUB, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())
        
        // SHR - 8xy6
        .addInstruction(Mnemonics.SHR, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())

        // SUBN - 8xy7
        .addInstruction(Mnemonics.SUBN, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())

        // SHL - 8xyE
        .addInstruction(Mnemonics.SHL, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.REGISTER)))
            .build())

        // RND - Cxkk
        .addInstruction(Mnemonics.RND, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.BYTE)))
            .build())
        
        // DRW - Dxyn
        .addInstruction(Mnemonics.DRW, OperandsParser.builder()
            .addOperand(operand(Operands.REGISTER), OperandsParser.builder()
                .addOperand(operand(Operands.REGISTER), OperandsParser.arg(operand(Operands.NIBBLE)))
                .build())
            .build())
        
        // SKP - Ex9E
        .addInstruction(Mnemonics.SKP, OperandsParser.arg(operand(Operands.REGISTER)))

        // SKNP - ExA1
        .addInstruction(Mnemonics.SKNP, OperandsParser.arg(operand(Operands.REGISTER)))

        .build())
    
    .addParser([TokenTypes.BIN, TokenTypes.HEX, TokenTypes.DEC], new DataParser())

    .build();


export default parser;