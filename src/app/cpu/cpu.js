import Opcode from './opcode';
import font from './font';


class Cpu {
    constructor(instructions) {
        this.reset();
        this.instructions = instructions;
    }

    reset() {
        this.pc = 0x200;
        this.registers = new Uint8Array(16);
        this.memory = new Uint8Array(4096);
        this.stack = new Uint16Array(16);
        this.gfx = new Array(64 * 32);
        this.keys = new Array(16);
        this.sp = 0;
        this.delayTimer = 0;
        this.soundTimer = 0;
        this.i = 0;
        this.blocked = false;
        this.keyCallback = null;
        this.memory.set(font);
        this.gfx.fill(0);
        this.keys.fill(false);

        this.blocked = true;
    }

    load(data) {
        this.reset();
        this.memory.set(data, this.pc);
        this.blocked = false;
    }

    tick() {
        if (this.blocked)
            return;

        const value = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        if (value === 0)
            return;

        const opcode = new Opcode(value);
        const instruction = this.instructions.find(i => (opcode.value & i.mask) === i.match);

        instruction.execute(this, opcode);
    }

    updateTimers() {
        if (this.soundTimer > 0)
            this.soundTimer--;

        if (this.delayTimer > 0)
            this.delayTimer--;
    }

    keyDown(key) {
        this.keys[key] = true;

        if (this.keyCallback) {
            this.keyCallback(key);
            this.keyCallback = false;
        }
    }

    keyUp(key) {
        this.keys[key] = false;
    }

    static builder() {
        return new CpuBuilder();
    }
}

class CpuBuilder {
    constructor() {
        this.instructions = [];
    }

    addInstruction(match, mask, instruction) {
        this.instructions.push({
            match,
            mask,
            execute: instruction,
        });

        return this;
    }

    build() {
        return new Cpu(this.instructions);
    }
}


export default Cpu;