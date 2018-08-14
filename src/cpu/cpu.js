import Opcode from 'chip8/cpu/opcode.js';


class Cpu {
    constructor() {
        this.mem = new Uint8Array(4096);
        this.registers = new Uint8Array(16);
    }

    reset() {
        this.mem.fill(0);
        this.registers.fill(0);
        this.i = 0;
        this.delay = 0;
        this.sound = 0;
        this.pc = 0x200;
        this.stack = [];
    }

    load(romData) {
        this.reset();
        this.mem.set(romData, this.pc);
    }

    getCurrentOpcode() {
        const a = this.mem[this.pc];
        const b = this.mem[this.pc + 1];
        const dec = (a << 8) | b;

        return new Opcode(dec);
    }

    executeInstruction() {
        const opcode = this.getCurrentOpcode();
        // TODO: Do stuff
    }
}

export default Cpu;
