import {opcode} from 'chip8/cpu/opcode.js';
import {toString} from 'chip8/cpu/instructions';

const disassemble = (romData) => {
    const lines = [];
    for (let i = 0; i < romData.length; i+=2) {
        const op = opcode(romData[i], romData[i+1]);
        const address = 0x200 + i;
        try {
            lines.push({
                address,
                instruction: toString(op),
            });
        } catch (e) {
            lines.push({
                address,
                instruction: op.toString(),
            });
        }
    }

    return lines;
};

export default disassemble;
