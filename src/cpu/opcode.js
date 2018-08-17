class Opcode {
    constructor(opcode) {
        this.opcode = opcode;
    }

    get(index) {
        const shift = (3 - index) * 4;
        const mask = 0xF << shift;

        return (this.opcode & mask) >> shift;
    }

    equals(opcode) {
        return this.opcode == opcode;
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

export default Opcode;
