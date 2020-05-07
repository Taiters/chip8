class Opcode {
    constructor(value) {
        this.value = value;
    }

    get x() {
        return (this.value & 0x0F00) >> 8;
    }

    get y() {
        return (this.value & 0x00F0) >> 4;
    }

    get nnn() {
        return this.value & 0xFFF;
    }

    get nn() {
        return this.value & 0xFF;
    }

    get n() {
        return this.value & 0xF;
    }
}


export default Opcode;