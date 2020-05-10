import {
    TokenTypes,
    Mnemonics,
} from './constants';


const Tokens = [
    {
        type: TokenTypes.MNEMONIC,
        match: new RegExp(`(?:${Object.values(Mnemonics).join('|')})(?![A-Z])`, 'i'),
        value: (match) => Mnemonics[match.toUpperCase()],
    },
    {
        type: TokenTypes.REGISTER,
        match: /v[0-9A-F](?![A-Z])/i,
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
        match: /DT(?![A-Z])/i,
    },
    {
        type: TokenTypes.SOUND_TIMER,
        match: /ST(?![A-Z])/i,
    },
    {
        type: TokenTypes.K,
        match: /K(?![A-Z])/i,
    },
    {
        type: TokenTypes.I,
        match: /I(?![A-Z])/i,
    },
    {
        type: TokenTypes.F,
        match: /F(?![A-Z])/i,
    },
    {
        type: TokenTypes.B,
        match: /B(?![A-Z])/i,
    },
    {
        type: TokenTypes.COMMA,
        match: /,/,
    },
    {
        type: TokenTypes.DEFINE,
        match: /DEFINE(?![A-Z])/i,
    },
    {
        type: TokenTypes.IDENTIFIER,
        match: /[A-Z_-]+\b/i,
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
        match: /;.*/,
        value: (match) => match.slice(2).trim(),
    },
    {
        type: TokenTypes.COLON,
        match: /:/,
    },
    {
        type: TokenTypes.EOF,
        match: /^$/,
    },
    {
        type: TokenTypes.INVALID_TOKEN,
        match: /\S+/,
    },
];

const tokenLookup = Tokens.reduce((t, current) => {
    t[current.type] = current;
    return t;
}, {});

const getToken = (type) => tokenLookup[type];


export {
    Tokens,
    getToken,
};