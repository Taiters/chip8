import { TokenTypes } from '../tokens';


class ProgramParser {
    constructor(sectionParser) {
        this.sectionParser = sectionParser;
    }

    parse(tokens) {
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