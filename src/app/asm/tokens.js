// @flow
import type {
    TokenType,
} from './constants';
import {
    TokenTypes,
    Mnemonics,
} from './constants';

type TokenDefinition = {
    type: TokenType,
    match: RegExp,
    value(match: string): string | number,
}

const Tokens: Array<TokenDefinition> = [
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
        value: (match) => match,
    },
    {
        type: TokenTypes.SOUND_TIMER,
        match: /ST(?![A-Z])/i,
        value: (match) => match,
    },
    {
        type: TokenTypes.K,
        match: /K(?![A-Z])/i,
        value: (match) => match,
    },
    {
        type: TokenTypes.I,
        match: /I(?![A-Z])/i,
        value: (match) => match,
    },
    {
        type: TokenTypes.F,
        match: /F(?![A-Z])/i,
        value: (match) => match,
    },
    {
        type: TokenTypes.B,
        match: /B(?![A-Z])/i,
        value: (match) => match,
    },
    {
        type: TokenTypes.COMMA,
        match: /,/,
        value: (match) => match,
    },
    {
        type: TokenTypes.DEFINE,
        match: /DEFINE(?![A-Z])/i,
        value: (match) => match,
    },
    {
        type: TokenTypes.IDENTIFIER,
        match: /[A-Z_-]+\b/i,
        value: (match) => match,
    },
    {
        type: TokenTypes.WS,
        match: /[\t ]+/,
        value: (match) => match,
    },
    {
        type: TokenTypes.EOL,
        match: /(?:\r?\n)/,
        value: (match) => match,
    },
    {
        type: TokenTypes.COMMENT,
        match: /;.*/,
        value: (match) => match.slice(2).trim(),
    },
    {
        type: TokenTypes.COLON,
        match: /:/,
        value: (match) => match,
    },
    {
        type: TokenTypes.EOF,
        match: /^$/,
        value: (match) => match,
    },
    {
        type: TokenTypes.INVALID_TOKEN,
        match: /.*/,
        value: (match) => match,
    },
];

const tokenLookup = Tokens.reduce((t, current) => {
    t[current.type] = current;
    return t;
}, {});

const getToken = (type: TokenType) => tokenLookup[type];


export type Token = {
    type: TokenType,
    value: string | number,
    raw: string,
    column: number,
    line: number,
};

export {
    Tokens,
    getToken,
};