import StringScanner from 'chip8/assembler/stringScanner.js';


const OPERATION = /cls|ret|jp|call|se|sne|ld|add|or|and|xor|sub|shr|subn|shl|rnd|draw|skp|sknp/i;
const IDENTIFIER = /dt|st|i|f|b|i/i;


const parseOperation = (scanner) => {
    const result = scanner.scan(OPERATION);

    if (!result)
        throw 'Unexpected symbol when parsing operation';

    return result;
};

const parseArg = (scanner) => {
    if (scanner.scan('v')) {
        const register = scanner.scan(/[0-9A-F]/i);
        if (!register)
            throw 'Unexpected symbol when parsing register';

        return {
            type: 'register',
            value: parseInt(register, 16)
        };
    }

    if (scanner.scan(/0x/i)) {
        const number = scanner.scan(/[0-9A-F]+/i);
        if (!number)
            throw 'Unexpected symbol when parsing number';

        return {
            type: 'number',
            value: parseInt(number, 16)
        };
    }

    const number = scanner.scan(/\d+/);
    if (number) {
        return {
            type: 'number',
            value: parseInt(number)
        };
    }

    const identifier = scanner.scan(IDENTIFIER);
    if (identifier && !scanner.next(/\w/)) {
        return {
            type: 'identifier',
            value: identifier 
        };
    }

    const label = scanner.scan(/\w+/);
    if (label) {
        return {
            type: 'label',
            value: identifier ? identifier + label : label
        };
    }

    throw 'Unexpected symbol when parsing argument';
};

const parseArgs = (scanner) => {
    const args = [];
    while (true) {
        args.push(parseArg(scanner));
        if (!scanner.scan(/, */))
            break;
    }

    return args;
};

const parseInstruction = (scanner) => {
    const operation = parseOperation(scanner);
    scanner.scan(/ +/)
    const args = scanner.next(/\w/) ? parseArgs(scanner) : [];

    return {
        type: 'instruction',
        operation: operation,
        args: args
    };
};

const parseInstructions = (scanner) => {
    const instructions = [];
    while (true) {
        instructions.push(parseInstruction(scanner)); 
        scanner.skipToNextChar();
        if (!scanner.next(OPERATION))
            break;
    }

    return instructions;
};

const parseData = (scanner) => {
    const data = [];
    while (scanner.scan('0b')) {
        const value = scanner.scan(/\d+/);
        data.push(parseInt(value, 2));
        scanner.skipToNextChar();
    }

    return data;
};

const parseLabel = (scanner) => {
    scanner.scan(':');
    return scanner.scan(/\w+/);
}

const parseSection = (scanner) => {
    var label = null;
    if (scanner.next(':')) {
        label = parseLabel(scanner);
        scanner.skipToNextChar();
    }

    if (scanner.next(OPERATION)) {
        return {
            type: 'instructions',
            label: label,
            instructions: parseInstructions(scanner)
        };
    } else if (scanner.next('0b') && label != null) {
        return {
            type: 'data',
            label: label,
            data: parseData(scanner)
        };
    }

    throw 'Unexpected section contents ' + scanner.str;
};

const parseProgram = (scanner) => {
    const sections = [];
    while (!scanner.eof()) {
        sections.push(parseSection(scanner));
        scanner.skipToNextChar();
    }

    return {
        sections: sections
    };
};

const parse = (str) => {
    const scanner = new StringScanner(str);
    scanner.skipToNextChar();
    return parseProgram(scanner);
};

export default {
    parse
};
