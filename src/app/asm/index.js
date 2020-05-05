import tokenize from './tokenizer';
import parser from './parser';

    
function parse(str) {
    const tokens = tokenize(str);
    return parser.parse(tokens);
}


export default parse;