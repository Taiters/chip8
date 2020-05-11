import { TokenTypes } from '../constants';
import { TokenStream } from './tokenStream';
import { ExistingLabelException, UnexpectedTokenException } from './exceptions';
import { expectNextToken } from './utils';


class ProgramParser {
    constructor(parsers) {
        this.parsers = parsers;
    }

    getLabel(tokens) {
        if (tokens.peek().type === TokenTypes.IDENTIFIER) {
            const label = tokens.next();

            expectNextToken(tokens, TokenTypes.COLON);
            tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);

            return label;
        }

        return null;
    }

    parseDefinitions(tokens) {
        const definitions = new Map();
        
        tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
        while(tokens.peek().type === TokenTypes.DEFINE) {
            tokens.next();
            tokens.skip(TokenTypes.WS);

            const identifier = expectNextToken(tokens, TokenTypes.IDENTIFIER);

            tokens.skip(TokenTypes.WS);
            expectNextToken(tokens, TokenTypes.COMMA);
            tokens.skip(TokenTypes.WS);

            const value = expectNextToken(tokens, 
                TokenTypes.REGISTER,
                TokenTypes.HEX,
                TokenTypes.BIN,
                TokenTypes.DEC
            );

            if (typeof identifier.value === 'string') {
                definitions.set(identifier.value, value);
            } else {
                throw 'Expected string value in definition identifier';
            }

            tokens.skip(TokenTypes.WS, TokenTypes.COMMENT);
            expectNextToken(tokens, TokenTypes.EOL);
            tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
        }

        return definitions;
    }

    parse(src) {
        const tokens = new TokenStream(src);
        const labels = new Set();
        const lines = [];
        const definitions = this.parseDefinitions(tokens);

        tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
        while(tokens.peek().type !== TokenTypes.EOF) {
            const label = this.getLabel(tokens);

            if (label) {
                if (labels.has(label.value) || label.value in definitions)
                    throw new ExistingLabelException(label);

                labels.add(label.value);
            }

            const nextToken = tokens.peek();
            const parser = this.parsers.find(p => p.match.includes(nextToken.type))?.parser;

            if (!parser) {
                const allValidTokens = this.parsers.reduce((tokens, parser) => {
                    for (const type of parser.match)
                        tokens.add(type);
                    
                    return tokens;
                }, new Set([TokenTypes.LABEL]));

                throw new UnexpectedTokenException(nextToken, allValidTokens);
            }

            const result = parser.parse(tokens, definitions);
            result['label'] = label;

            lines.push(result);
            tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
        }

        return {
            lines,
        };
    }

    static builder() {
        return new ProgramParserBuilder();
    }
}

class ProgramParserBuilder {
    constructor() {
        this.parsers = [];
    }

    addParser(matchTokens, parser) {
        this.parsers.push({
            match: matchTokens,
            parser,
        });
        return this;
    }

    build() {
        return new ProgramParser(this.parsers);
    }
}


export {
    ProgramParser,
};