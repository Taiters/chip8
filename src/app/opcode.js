class Opcode {
    constructor(opcode) {
        this.opcode = opcode;
    }

    get(index) {
        const shift = (3 - index) * 4;
        const mask = 0xF << shift;

        return (this.opcode & mask) >> shift;
    }

    equals(opcode, mask = null) {
        if (mask == null)
            return this.opcode == opcode;

        return (this.opcode & mask) == opcode;
    }

    get i () {
        return this.get(0);
    }

    get vx() {
        return this.get(1);
    }

    get vy() {
        return this.get(2);
    }

    get nnn() {
        return this.opcode & 0x0FFF;
    }

    get nn() {
        return this.opcode & 0x00FF;
    }

    get n() {
        return this.get(3);
    }

    toString() {
        return this.opcode.toString(16).padStart(4, '0');
    }
}

class OpcodeFactory {
    constructor() {
        this.cache = [];
    }

    create(byte1, byte2 = null) {
        let opcodeValue = null;
        if (byte2 == null) {
            opcodeValue = byte1; 
        } else {
            opcodeValue = (byte1 << 8) | byte2;
        }

        let opcodeResult = this.cache[opcodeValue];
        if (typeof(opcodeResult) === 'undefined') {
            opcodeResult = new Opcode(opcodeValue);
            this.cache[opcodeValue] = opcodeResult;
        }

        return opcodeResult;
    }
}

const factoryInstance = new OpcodeFactory();
const createOpcode = (byte1, byte2 = null) => factoryInstance.create(byte1, byte2);

export {
    Opcode,
    OpcodeFactory,
    createOpcode,
};
