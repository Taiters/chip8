import tokenize from './tokenizer';
import parser from './parser';
import assembler from './assembler';
import {
    Sections
} from './constants';


const BYTES_PER_LINE = {};
BYTES_PER_LINE[Sections.INSTRUCTIONS] = 2;
BYTES_PER_LINE[Sections.DATA] = 1;

const hex = (val) => `0x${val.toString(16).padStart(2, '0')}`;
const bin = (val) => `0b${val.toString(2).padStart(8, '0')}`;

function parse(str) {
    const tokens = tokenize(str);
    return parser.parse(tokens);
}

function assemble(program) {
    const assembled = assembler.assemble(program);

    let addr = 0x200;
    for (const i of assembled) {
        console.log(`${hex(addr)}: ${hex(i)} | ${bin(i)} | ${i}`); // eslint-disable-line no-console
        addr += 1;
    }

    return assembled;
}


export {
    parse,
    assemble,
};