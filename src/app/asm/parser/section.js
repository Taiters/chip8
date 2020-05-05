import { TokenTypes } from '../constants';
import { UnexpectedTokenException } from './exceptions';


const TERMINATORS = [
    TokenTypes.EOF,
    TokenTypes.SECTION_DEFINITION,
];

class SectionParser {
    constructor(sectionDefinitions) {
        this.sectionDefinitions = sectionDefinitions;
    }

    getName(tokens) {
        if (tokens.peek().type === TokenTypes.SECTION_DEFINITION)
            return tokens.next().value;
        return null;
    }

    parseLines(tokens, sectionDefinition) {
        const lines = [];
        const lineParser = sectionDefinition.lineParser;
        const startTokens = sectionDefinition.startTokens;

        do {
            if (!startTokens.includes(tokens.peek().type))
                throw new UnexpectedTokenException(tokens.next(), tokens.context(), startTokens);

            lines.push(lineParser.parse(tokens));
            tokens.skip(TokenTypes.WS, TokenTypes.COMMENT, TokenTypes.EOL);
        } while (!TERMINATORS.includes(tokens.peek().type));

        return lines;
    }

    parse(tokens) {
        const name = this.getName(tokens);
        tokens.skip(TokenTypes.WS, TokenTypes.COMMENT, TokenTypes.EOL);

        const nextToken = tokens.peek();
        for (const sectionDefinition of this.sectionDefinitions) {
            if (sectionDefinition.startTokens.includes(nextToken.type)) {
                return({
                    name,
                    type: sectionDefinition.type,
                    lines: this.parseLines(tokens, sectionDefinition)
                });
            }
        }

        const expectedStartTokens = this.sectionDefinitions.reduce((expected, definition) => [...expected, ...definition.startTokens], []);
        throw new UnexpectedTokenException(nextToken, tokens.context(), expectedStartTokens);
    }

    static builder() {
        return new SectionParserBuilder();
    }
}

class SectionParserBuilder {
    constructor() {
        this.sectionDefinitions = [];
    }

    addSection(type, startTokens, lineParser) {
        this.sectionDefinitions.push({
            type,
            startTokens,
            lineParser
        });
        return this;
    }

    build() {
        return new SectionParser(this.sectionDefinitions);
    }
}


export default SectionParser;