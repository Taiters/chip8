import { TokenTypes } from '../constants';
import { TokenStream } from './tokenStream';
import { DuplicateLabelException, UnexpectedTokenException } from './exceptions';


class ProgramParser {
    constructor(parsers) {
        this.parsers = parsers;
    }

    getLabel(tokens) {
        if (tokens.peek().type === TokenTypes.LABEL) {
            const label = tokens.next();
            tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);

            return label;
        }

        return null;
    }

    parse(src) {
        const tokens = new TokenStream(src);
        const lines = [];
        const labels = new Set();

        tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
        while(tokens.peek().type !== TokenTypes.EOF) {
            const label = this.getLabel(tokens);

            if (label) {
                if (labels.has(label.value))
                    throw new DuplicateLabelException(label);

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

            const result = parser.parse(tokens);
            result['label'] = label;

            lines.push(result);
            tokens.skip(TokenTypes.WS, TokenTypes.EOL, TokenTypes.COMMENT);
        }

        return {
            lines
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