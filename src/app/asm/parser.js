import tokenize from './tokenizer';
import Instructions from './instructions';
import { TokenTypes } from './tokens';
import {
    ProgramParser,
    SectionParser,
    DataParser,
    InstructionParser,
    ArgsParser
} from './parsers';
import {
    register,
    addr,
    byte,
    nibble,
    dt,
    k,
    i
} from './parsers/args';


const parser = new ProgramParser(SectionParser.builder()
    .addSection('instructions', TokenTypes.INSTRUCTION, InstructionParser.builder()

        // CLS - 00E0
        .addInstruction(Instructions.CLS, ArgsParser.noArgs())

        // RET - 00EE
        .addInstruction(Instructions.RET, ArgsParser.noArgs())

        // JP - 1nnn, Bnnn
        .addInstruction(Instructions.JP, ArgsParser.builder()
            .addArg(addr())
            .addArgTypes(
                [TokenTypes.REGISTER],
                [(v) => v === 0, 'Only v0 is valid here (JP v0, addr)'],
                ArgsParser.arg(addr()))
            .build())
        
        // CALL - 2nnn
        .addInstruction(Instructions.CALL, ArgsParser.arg(addr()))

        // SE - 3xkk, 5xy0
        .addInstruction(Instructions.SE, ArgsParser.builder()
            .addArg(register(), ArgsParser.builder()
                .addArg(byte())
                .addArg(register())
                .build())
            .build())

        // SNE - 4xkk, 9xy0
        .addInstruction(Instructions.SNE, ArgsParser.builder()
            .addArg(register(), ArgsParser.builder()
                .addArg(byte())
                .addArg(register())
                .build())
            .build())

        // LD - 6xkk, 8xy0, Annn, Fx07, Fx0A, Fx15, Fx18, Fx29, Fx33, Fx55, Fx65
        .addInstruction(Instructions.LD, ArgsParser.builder()
            .addArg(register(), ArgsParser.builder()
                .addArg(byte())
                .addArg(register())
                .addArg(dt())
                .addArg(k())
                .addArg(i())
                .build())
            .addArg(i(), ArgsParser.builder()
                .addArg(addr())
                .addArg(register())
                .build())
            .addArgTypes([
                TokenTypes.DELAY_TIMER,
                TokenTypes.SOUND_TIMER,
                TokenTypes.F,
                TokenTypes.B
            ], ArgsParser.arg(register()))
            .build())
        
        // ADD - 7xkk, 8xy4, Fx1E
        .addInstruction(Instructions.ADD, ArgsParser.builder()
            .addArg(i(), ArgsParser.arg(register()))
            .addArg(register(), ArgsParser.builder()
                .addArg(register())
                .addArg(byte())
                .build())
            .build())

        // OR - 8xy1
        .addInstruction(Instructions.OR, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(register()))
            .build())
        
        // AND - 8xy2
        .addInstruction(Instructions.AND, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(register()))
            .build())

        // XOR - 8xy3
        .addInstruction(Instructions.XOR, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(register()))
            .build())

        // SUB - 8xy5
        .addInstruction(Instructions.SUB, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(register()))
            .build())
        
        // SHR - 8xy6
        .addInstruction(Instructions.SHR, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(register()))
            .build())

        // SUBN - 8xy7
        .addInstruction(Instructions.SUBN, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(register()))
            .build())

        // SHL - 8xyE
        .addInstruction(Instructions.SHL, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(register()))
            .build())

        // RND - Cxkk
        .addInstruction(Instructions.RND, ArgsParser.builder()
            .addArg(register(), ArgsParser.arg(byte()))
            .build())
        
        // DRW - Dxyn
        .addInstruction(Instructions.DRW, ArgsParser.builder()
            .addArg(register(), ArgsParser.builder()
                .addArg(register(), ArgsParser.arg(nibble()))
                .build())
            .build())
        
        // SKP - Ex9E
        .addInstruction(Instructions.SKP, ArgsParser.arg(register()))

        // SKNP - ExA1
        .addInstruction(Instructions.SKNP, ArgsParser.arg(register()))

        .build())
    
    .addSection('data', TokenTypes.BIN, new DataParser())
    .build());
    

function parse(str) {
    const tokens = tokenize(str);

    return parser.parse(tokens);
}


export default parse;