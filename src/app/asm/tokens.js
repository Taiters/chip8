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
    HEX: 'HEX',
    BIN: 'BIN',
    DEC: 'DEC',
    I: 'I',
    COMMA: 'COMMA',
    WS: 'WS',
    EOL: 'EOL',
    COMMENT: 'COMMENT',
};

const Tokens = [
    {
        type: TokenTypes.INSTRUCTION,
        match: new RegExp(`(${Object.values(Instructions).join('|')})`, 'i'),
        value: (match) => match.toUpperCase(),
    },
    {
        type: TokenTypes.REGISTER,
        match: /v[0-9A-F]/i,
        value: (match) => ({
            type: 'register',
            value: parseInt(match.slice(1), 16),
        })
    },
    {
        type: TokenTypes.HEX,
        match: /0x[0-9A-F]+/i,
        value: (match) => ({
            type: 'constant',
            value: parseInt(match.slice(2), 16),
        }),
    },
    {
        type: TokenTypes.BIN,
        match: /0b[0-9A-F]+/i,
        value: (match) => ({
            type: 'constant',
            value: parseInt(match.slice(2), 2),
        }),
    },
    {
        type: TokenTypes.DEC,
        match: /[0-9]+/i,
        value: (match) => ({
            type: 'constant',
            value: parseInt(match),
        }),
    },
    {
        type: TokenTypes.I,
        match: /I/i,
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


export {
    Instructions,
    TokenTypes,
    Tokens,
    getToken,
};