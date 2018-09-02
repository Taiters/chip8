import {opcode} from 'chip8/cpu/opcode.js';
import {execute} from 'chip8/cpu/instructions';
import keyboard from 'chip8/cpu/keyboard.js';
import font from 'chip8/cpu/font.js';

class Cpu {
    constructor(display) {
        this.display = display;

        this.state = {};
        this.decrementTimers = this.decrementTimers.bind(this);

        setInterval(this.decrementTimers, 1000/60);
        keyboard(this.onKeyDown.bind(this), 
            this.onKeyUp.bind(this));
    }

    reset() {
        this.state = {
            i: 0,
            pc: 0x200,
            delay: 0,
            sound: 0,
            gfx: new Array(2048),
            mem: new Uint8Array(4096),
            registers: new Uint8Array(16),
            stack: [],
            keyboard: [],
            drawFlag: false,
            clearFlag: false,
            waitKeyFlag: false,
            waitKeyRegister: null,
        };
        this.state.mem.fill(0);
        this.state.mem.set(font);
        this.state.registers.fill(0);
        this.state.gfx.fill(0);
        this.display.clear();
    }

    decrementTimers() {
        if (this.state.delay > 0)
            this.state.delay--;

        if (this.state.sound > 0)
            this.state.sound--;
    }

    load(romData) {
        this.reset();
        this.state.mem.set(romData, this.state.pc);
    }

    getCurrentOpcode() {
        return opcode(
            this.state.mem[this.state.pc],
            this.state.mem[this.state.pc + 1]);
    }

    onKeyDown(key) {
        this.state.keyboard[key] = 1;

        if (this.state.waitKeyFlag) {
            this.state.waitKeyFlag = false;
            this.state.registers[this.state.waitKeyRegister] = key;
            this.state.waitKeyRegister = null;
            this.state.pc += 2;
        }
    }

    onKeyUp(key) {
        this.state.keyboard[key] = 0;
    }

    tick() {
        if (this.state.waitKeyFlag)
            return;

        this.state = execute(this.state, this.getCurrentOpcode());

        if (this.state.clearFlag) {
            this.display.clear();
            this.state.clearFlag = false;
        }

        if (this.state.drawFlag) {
            this.render();
            this.state.drawFlag = false;
        }
    }

    render() {
        const l = this.state.gfx.length;
        for (let i = 0; i < l; i++) {
            const x = i % 64;
            const y = Math.floor(i / 64);
            if (this.state.gfx[i] == 0)
                this.display.clearCell(x, y);
            else
                this.display.fillCell(x, y);
        }
    }
}

export default Cpu;
