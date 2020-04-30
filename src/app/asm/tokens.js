const identity = (v) => v;
const hex = (v) => parseInt(v, 16);

const Instructions = {
    CLS: 'CLS',
    RET: 'RET',
    JP: 'JP',
    CALL: 'CALL',
    SKP: 'SKP',
    SKNP: 'SKNP',
    SE: 'SE',
    SNE: 'SNE',
    LD: 'LD',
    ADD: 'ADD',
    SUB: 'SUB',
    SUBN: 'SUBN',
    AND: 'AND',
    OR: 'OR',
    XOR: 'XOR',
    SHR: 'SHR',
    SHL: 'SHL',
    RND: 'RND',
    DRW: 'DRW',
};

const TokenTypes = {
    INSTRUCTION: 'INSTRUCTION',
    REGISTER: 'REGISTER',
    ADDR: 'ADDR',
    BYTE: 'BYTE',
    NIBBLE: 'NIBBLE',
    I: 'I',
    COMMA: 'COMMA',
    WS: 'WS',
    EOL: 'EOL',
    COMMENT: 'COMMENT',
};

const Tokens = [
    {
        type: TokenTypes.INSTRUCTION,
        match: new RegExp(`^(${Object.values(Instructions).join('|')})`, 'i'),
        value: identity,
    },
    {
        type: TokenTypes.REGISTER,
        match: /^v[0-9A-F]/i,
        value: (match) => hex(match.slice(1)),
    },
    {
        type: TokenTypes.HEX_ADDR,
        match: /^0x[0-9A-F]{3}/i,
        value: hex,
    },
    {
        type: TokenTypes.HEX_BYTE,
        match: /^0x[0-9A-F]{2}/i,
        value: hex,
    },
    {
        type: TokenTypes.HEX_NIBBLE,
        match: /^0x[0-9A-F]/i,
        value: hex,
    },
    {
        type: TokenTypes.I,
        match: /^I/i,
        value: identity,
    },
    {
        type: TokenTypes.COMMA,
        match: /^,/,
        value: identity,
    },
    {
        type: TokenTypes.WS,
        match: /^[\t ]+/,
        value: identity,
    },
    {
        type: TokenTypes.EOL,
        match: /^(?:\r?\n)/,
        value: identity,
    },
    {
        type: TokenTypes.COMMENT,
        match: /^\/\/.*/,
        value: (match) => match.slice(2).trim(),
    },
];


export {
    Instructions,
    TokenTypes,
    Tokens,
};