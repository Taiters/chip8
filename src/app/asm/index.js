import parser from './parser';
import assembler from './assembler';
import TokenStream from './tokenStream';


function parse(src) {
    const tokens = new TokenStream(src);
    return parser.parse(tokens);
}

function assemble(program) {
    return assembler.assemble(program);
}


export {
    parse,
    assemble,
};