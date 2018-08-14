class Opcode {
    constructor(opcode) {
        this.opcode = opcode;
    }

    get i () {
        return (this.opcode & 0xF000) >> 12;
    }

    get vx() {
        return (this.opcode & 0x0F00) >> 8;
    }

    get vy() {
        return (this.opcode & 0x00F0) >> 4;
    }

    get nnn() {
        return this.opcode & 0x0FFF;
    }

    get nn() {
        return this.opcode & 0x00FF;
    }

    get n() {
        return this.opcode & 0x000F;
    }
}

export default Opcode;
