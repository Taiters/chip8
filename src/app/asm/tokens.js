import {
    TokenTypes,
    Instructions
} from './constants';


const Tokens = [
    {
        type: TokenTypes.INSTRUCTION,
        match: new RegExp(`(${Object.values(Instructions).join('|')})`, 'i'),
        value: (match) => Instructions[match.toUpperCase()],
    },
    {
        type: TokenTypes.SECTION_DEFINITION,
        match: /:[A-Z]+/i,
        value: (match) => match.slice(1),
    },
    {
        type: TokenTypes.SECTION_IDENTIFIER,
        match: /\$[A-Z]+/i,
        value: (match) => match.slice(1),
    },
    {
        type: TokenTypes.REGISTER,
        match: /v[0-9A-F]/i,
        value: (match) => parseInt(match.slice(1), 16),
    },
    {
        type: TokenTypes.HEX,
        match: /0x[0-9A-F]+/i,
        value: (match) => parseInt(match.slice(2), 16),
    },
    {
        type: TokenTypes.BIN,
        match: /0b[0-9A-F]+/i,
        value: (match) => parseInt(match.slice(2), 2),
    },
    {
        type: TokenTypes.DEC,
        match: /[0-9]+/i,
        value: (match) => parseInt(match),
    },
    {
        type: TokenTypes.DELAY_TIMER,
        match: /DT/i,
    },
    {
        type: TokenTypes.SOUND_TIMER,
        match: /ST/i,
    },
    {
        type: TokenTypes.K,
        match: /K/i,
    },
    {
        type: TokenTypes.I,
        match: /I/i,
    },
    {
        type: TokenTypes.F,
        match: /F/i,
    },
    {
        type: TokenTypes.B,
        match: /B/i,
    },
    {
        type: TokenTypes.COMMA,
        match: /,/,
    },
    {
        type: TokenTypes.WS,
        match: /[\t ]+/,
    },
    {
        type: TokenTypes.EOL,
        match: /(?:\r?\n)/,
    },
    {
        type: TokenTypes.COMMENT,
        match: /\/\/.*/,
        value: (match) => match.slice(2).trim(),
    },
];

const tokenLookup = Tokens.reduce((t, current) => {
    t[current.type] = current;
    return t;
}, {});

const getToken = (type) => tokenLookup[type];

class TokenStream {
    constructor(tokens) {
        this.offset = 0;
        this.tokens = tokens;
    }

    skip(...typesToSkip) {
        while (this.hasNext()) {
            if (!typesToSkip.includes(this.peek().type))
                break;

            this.next();
        }
    }

    next() {
        const nextToken = this.tokens[this.offset];
        this.offset++;

        return nextToken;
    }

    peek() {
        return this.tokens[this.offset];
    }

    hasNext() {
        return this.offset < this.tokens.length;
    }

    context() {
        return this.tokens
            .slice(Math.max(0, this.offset - 2), this.offset + 2)
            .map((t) => t.raw)
            .join('');
    }
}


export {
    Tokens,
    TokenStream,
    getToken,
};