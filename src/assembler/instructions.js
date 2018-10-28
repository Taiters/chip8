const assembleRet = (args) => {
    if (args.length != 0)
        throw 'Unexpected args for ret';
        
    return 0x00EE;
};

const assembleJump = (args) => {
    if (args.length != 1)
        throw 'Unexpected arg count for jp';

    if (args[0].type != 'address')
        throw 'Unexpected arg type for jp';

    return 0x1000 | (args[0].value & 0x0FFF);
};

const assembleCall = (args) => {
    if (args.length != 1)
        throw 'Unexpected arg count for call';

    if (args[0].type != 'address')
        throw 'Unexpected arg type for call';

    return 0x2000 | (args[0].value & 0x0FFF);
};

const assembleLoad = (args) => {
    if (args.length != 2)
        throw 'Unexpected arg count for ld';

    if (args[0].type == 'register') {
        if (args[1].type == 'number') {
            return 0x6000 |
                ((args[0].value & 0xF) << 8) |
                (args[1].value & 0xFF);
        }

        if (args[1].type == 'register') {
            return 0x8001 |
                ((args[0].value & 0xF) << 8) |
                ((args[1].value & 0xF) << 4);
        }

        if (args[1].type == 'identifier') {
            let identifier = args[1].value.toLowerCase();
            if (identifier == 'dt')
                return 0xF007 | ((args[0].value & 0xF) << 8);

            if (identifier == 'k')
                return 0xF00A | ((args[0].value & 0xF) << 8);

            throw 'Unexpected identifier for LD Vx, ...';
        }

        throw 'Unexpected second arg for LD Vx, ...';
    }

    if (args[0].type == 'identifier') {
        let identifier = args[0].value.toLowerCase();
        if (identifier == 'i') {
            if (args[1].type != 'address')
                throw 'Expected address for LD I, ...';

            return 0xA000 | (args[1].value & 0x0FFF);
        }

        if (identifier == 'dt') {
            if (args[1].type != 'register')
                throw 'Expected register for LD DT, ...';

            return 0xF015 | ((args[1].value & 0xF) << 8);
        }

        if (identifier == 'st') {
            if (args[1].type != 'register')
                throw 'Expected register for LD ST, ...';

            return 0xF018 | ((args[1].value & 0xF) << 8);
        }

        if (identifier == 'f') {
            if (args[1].type != 'register')
                throw 'Expected register for LD F, ...';

            return 0xF029 | ((args[1].value & 0xF) << 8);
        }

        if (identifier == 'b') {
            if (args[1].type != 'register')
                throw 'Expected register for LD B, ...';

            return 0xF033 | ((args[1].value & 0xF) << 8);
        }

        throw 'Unexpected second arg for LD identifier, ...';
    }

    throw 'Unexpected first arg for LD';
};

const assembleSe = (args) => {
    if (args.length != 2)
        throw 'Unexpected arg count for SE';

    if (args[0].type == 'register') {
        if (args[1].type == 'number') {
            return 0x3000 |
                ((args[0].value & 0xF) << 8) |
                (args[1].value & 0xFF);
        }

        if (args[1].type == 'register') {
            return 0x5000 |
                ((args[0].value & 0xF) << 8) |
                ((args[1].value & 0xF) << 4);
        }

        throw 'Unexpected second arg for SE';
    }

    throw 'Unexpected first arg for SE';
};

const assembleSkp = (args) => {
    if (args.length != 1)
        throw 'Unexpected arg count for SKP';

    if (args[0].type != 'register')
        throw 'Expected register for SKP';

    return 0xE09E | ((args[0].value & 0xF) << 8);
};

const register = (operation, func) => {
    return {
        operation: operation,
        func: func
    }
};

const instructions = [
    register('ret', assembleRet),
    register('jp', assembleJump),
    register('call', assembleCall),
    register('ld', assembleLoad),
    register('se', assembleSe),
    register('skp', assembleSkp),
];

const getOpcode = (instruction) => {
    const result = instructions.find((i) => i.operation == instruction.operation);

    if (result == undefined)
        throw 'Unexpected operation ' + instruction.operation;

    return result.func(instruction.args);
};


export default getOpcode;
