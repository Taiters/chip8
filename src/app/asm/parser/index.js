import ProgramParser from './program';
import SectionParser from './section';
import InstructionParser from './instruction';
import DataParser from './data';
import ArgsParser, { ArgDefinitions } from './args';
import {
    Sections,
    TokenTypes,
    Instructions,
    Arguments,
} from '../constants';


const parser = new ProgramParser(SectionParser.builder()
    .addSection(Sections.INSTRUCTIONS, [TokenTypes.INSTRUCTION], InstructionParser.builder()

        // CLS - 00E0
        .addInstruction(Instructions.CLS, ArgsParser.noArgs())

        // RET - 00EE
        .addInstruction(Instructions.RET, ArgsParser.noArgs())

        // JP - 1nnn, Bnnn
        .addInstruction(Instructions.JP, ArgsParser.builder()
            .addArg(ArgDefinitions.ADDRESS)
            .addArg({
                type: Arguments.REGISTER,
                types: [TokenTypes.REGISTER],
                validator: (value) => [value === 0, 'Only v0 is valid in this context (JP v0, addr)']
            }, ArgsParser.arg(ArgDefinitions.ADDRESS))
            .build())
        
        // CALL - 2nnn
        .addInstruction(Instructions.CALL, ArgsParser.arg(ArgDefinitions.ADDRESS))

        // SE - 3xkk, 5xy0
        .addInstruction(Instructions.SE, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.builder()
                .addArg(ArgDefinitions.BYTE)
                .addArg(ArgDefinitions.REGISTER)
                .build())
            .build())

        // SNE - 4xkk, 9xy0
        .addInstruction(Instructions.SNE, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.builder()
                .addArg(ArgDefinitions.BYTE)
                .addArg(ArgDefinitions.REGISTER)
                .build())
            .build())

        // LD - 6xkk, 8xy0, Annn, Fx07, Fx0A, Fx15, Fx18, Fx29, Fx33, Fx55, Fx65
        .addInstruction(Instructions.LD, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.builder()
                .addArg(ArgDefinitions.BYTE)
                .addArg(ArgDefinitions.REGISTER)
                .addArg(ArgDefinitions.DELAY_TIMER)
                .addArg(ArgDefinitions.KEY)
                .addArg(ArgDefinitions.I)
                .build())
            .addArg(ArgDefinitions.I, ArgsParser.builder()
                .addArg(ArgDefinitions.ADDRESS)
                .addArg(ArgDefinitions.REGISTER)
                .build())
            .addArg(ArgDefinitions.DELAY_TIMER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .addArg(ArgDefinitions.SOUND_TIMER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .addArg(ArgDefinitions.FONT, ArgsParser.arg(ArgDefinitions.REGISTER))
            .addArg(ArgDefinitions.B, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())
        
        // ADD - 7xkk, 8xy4, Fx1E
        .addInstruction(Instructions.ADD, ArgsParser.builder()
            .addArg(ArgDefinitions.I, ArgsParser.arg(ArgDefinitions.REGISTER))
            .addArg(ArgDefinitions.REGISTER, ArgsParser.builder()
                .addArg(ArgDefinitions.REGISTER)
                .addArg(ArgDefinitions.BYTE)
                .build())
            .build())

        // OR - 8xy1
        .addInstruction(Instructions.OR, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())
        
        // AND - 8xy2
        .addInstruction(Instructions.AND, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())

        // XOR - 8xy3
        .addInstruction(Instructions.XOR, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())

        // SUB - 8xy5
        .addInstruction(Instructions.SUB, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())
        
        // SHR - 8xy6
        .addInstruction(Instructions.SHR, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())

        // SUBN - 8xy7
        .addInstruction(Instructions.SUBN, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())

        // SHL - 8xyE
        .addInstruction(Instructions.SHL, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.REGISTER))
            .build())

        // RND - Cxkk
        .addInstruction(Instructions.RND, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.BYTE))
            .build())
        
        // DRW - Dxyn
        .addInstruction(Instructions.DRW, ArgsParser.builder()
            .addArg(ArgDefinitions.REGISTER, ArgsParser.builder()
                .addArg(ArgDefinitions.REGISTER, ArgsParser.arg(ArgDefinitions.NIBBLE))
                .build())
            .build())
        
        // SKP - Ex9E
        .addInstruction(Instructions.SKP, ArgsParser.arg(ArgDefinitions.REGISTER))

        // SKNP - ExA1
        .addInstruction(Instructions.SKNP, ArgsParser.arg(ArgDefinitions.REGISTER))

        .build())
    
    .addSection(Sections.DATA, [
        TokenTypes.BIN,
        TokenTypes.HEX,
        TokenTypes.DEC,
    ], new DataParser())
    .build());


export default parser;