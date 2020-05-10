const Operands = {
    REGISTER: 'REGISTER',
    ADDRESS: 'ADDRESS',
    BYTE: 'BYTE',
    NIBBLE: 'NIBBLE',
    DELAY_TIMER: 'DELAY_TIMER',
    SOUND_TIMER: 'SOUND_TIMER',
    K: 'K',
    I: 'I',
    F: 'F',
    B: 'B',
};

const Mnemonics = {
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
    MNEMONIC: 'MNEMONIC',
    IDENTIFIER: 'IDENTIFIER',
    REGISTER: 'REGISTER',
    HEX: 'HEX',
    BIN: 'BIN',
    DEC: 'DEC',
    DELAY_TIMER: 'DELAY_TIMER',
    SOUND_TIMER: 'SOUND_TIMER',
    K: 'K',
    I: 'I',
    F: 'F',
    B: 'B',
    COMMA: 'COMMA',
    COLON: 'COLON',
    WS: 'WS',
    EOL: 'EOL',
    EOF: 'EOF',
    COMMENT: 'COMMENT',
    INVALID_TOKEN: 'INVALID_TOKEN',
};

const LineTypes = {
    INSTRUCTION: 'INSTRUCTION',
    DATA: 'DATA',
};


export {
    Operands,
    Mnemonics,
    TokenTypes,
    LineTypes,
};