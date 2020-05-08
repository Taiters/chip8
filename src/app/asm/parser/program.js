import { TokenTypes } from '../constants';
import TokenStream from './tokenStream';


class ProgramParser {
    constructor(sectionParser) {
        this.sectionParser = sectionParser;
    }

    parse(src) {
        const tokens = new TokenStream(src);
        const sections = [];

        tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
        while(tokens.peek().type !== TokenTypes.EOF) {
            sections.push(this.sectionParser.parse(tokens));
        }

        return {
            sections
        };
    }
}


export default ProgramParser;