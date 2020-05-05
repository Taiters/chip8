import InstructionParser from 'chip8/app/asm/parsers/instruction';
import Instructions from 'chip8/app/asm/instructions';
import ArgsParser from 'chip8/app/asm/parsers/args';
import TokenStream from 'chip8/app/asm/tokenStream';
import { TokenTypes } from 'chip8/app/asm/tokens';

import { token } from './utils';


describe('InstructionParser', () => {
    test('parse calls expected arg parser', () => {
        const callArgsParser = jest.fn(() => 'call');
        const retArgsParser = jest.fn(() => 'ret');
        const parser = InstructionParser.builder()
            .addInstruction(Instructions.CALL, {
                parse: callArgsParser
            })
            .addInstruction(Instructions.RET, {
                parse: retArgsParser
            })
            .build();

        const instructionToken = token(TokenTypes.INSTRUCTION, Instructions.RET);
        const tokens = new TokenStream([instructionToken]);

        const result = parser.parse(tokens);

        expect(callArgsParser.mock.calls.length).toBe(0);
        expect(retArgsParser.mock.calls.length).toBe(1);
        expect(result).toEqual({
            instruction: Instructions.RET,
            args: 'ret',
            token: instructionToken,
        });
    });
});