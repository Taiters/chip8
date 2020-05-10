import {
    TokenTypes,
    Mnemonics,
} from './constants';


const Tokens = [
    {
        type: TokenTypes.MNEMONIC,
        match: new RegExp(`(${Object.values(Mnemonics).join('|')})`, 'i'),
        value: (match) => Mnemonics[match.toUpperCase()],
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
        type: TokenTypes.LABEL,
        match: /[A-Z_-]+:/i,
        value: (match) => match.slice(0, -1),
    },
    {
        type: TokenTypes.IDENTIFIER,
        match: /[A-Z_-]+/i,
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