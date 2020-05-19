// @flow
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
    DEFINE: 'DEFINE',
    OPERAND_TYPE: 'OPERAND_TYPE',
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
    PLUS: 'PLUS',
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


type Operand = $Keys<typeof Operands>;
type Mnemonic = $Keys<typeof Mnemonics>;
type TokenType = $Keys<typeof TokenTypes>;
type LineType = $Keys<typeof LineTypes>;

export type {
    Operand,
    Mnemonic,
    TokenType,
    LineType,
};

export {
    Operands,
    Mnemonics,
    TokenTypes,
    LineTypes,
};