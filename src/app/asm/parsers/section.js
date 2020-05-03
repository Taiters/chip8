import { TokenTypes } from '../tokens';
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
        const startToken = sectionDefinition.startToken;

        do {
            if (tokens.peek().type !== startToken)
                throw new UnexpectedTokenException(tokens.next(), tokens.context(), [startToken]);

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
            if (nextToken.type === sectionDefinition.startToken) {
                return({
                    name,
                    type: sectionDefinition.type,
                    lines: this.parseLines(tokens, sectionDefinition)
                });
            }
        }

        const expectedStartTokens = this.sectionDefinitions.map((d) => d.startToken);
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

    addSection(type, startToken, lineParser) {
        this.sectionDefinitions.push({
            type,
            startToken,
            lineParser
        });
        return this;
    }

    build() {
        return new SectionParser(this.sectionDefinitions);
    }
}


export default SectionParser;