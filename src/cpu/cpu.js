import {opcode} from 'chip8/cpu/opcode.js';
import font from 'chip8/cpu/font.js';


class Cpu {
    constructor(keyboard, display) {
        this.keyboard = keyboard;
        this.display = display;

        this.keyboard.onKeyDown(this.onKeyDown.bind(this));
        this.decrementTimers = this.decrementTimers.bind(this);

        setInterval(this.decrementTimers, 1000/60);
    }

    reset() {
        this.isWaitingForKey = false;
        this.waitingForRegister = null;
        this.mem = new Uint8Array(4096);
        this.mem.fill(0);
        this.mem.set(font);
        this.registers = new Uint8Array(16);
        this.registers.fill(0);
        this.gfx = new Array(2048);
        this.gfx.fill(0);
        this.display.clear();
        this.i = 0;
        this.delay = 0;
        this.sound = 0;
        this.pc = 0x200;
        this.stack = [];
    }

    decrementTimers() {
        if (this.delay > 0)
            this.delay--;

        if (this.sound > 0)
            this.sound--;
    }

    load(romData) {
        this.reset();
        this.mem.set(romData, this.pc);
    }

    getCurrentOpcode() {
        const a = this.mem[this.pc];
        const b = this.mem[this.pc + 1];
        const dec = (a << 8) | b;

        return opcode(dec);
    }

    onKeyDown(key) {
        if (!this.isWaitingForKey)
            return;

        this.registers[this.waitingForRegister] = key;
        this.pc += 2;
        this.waitingForRegister = null;
        this.isWaitingForKey = false;
    }

    tick() {
        if (this.isWaitingForKey)
            return;

        const opcode = this.getCurrentOpcode();
        switch(opcode.get(0)) {
            case 0x0: {
                if (opcode.equals(0x00E0)) {
                    // 00E0: CLS
                    this.gfx.fill(0);
                    this.display.clear();
                    this.pc += 2;
                } else if (opcode.equals(0x00EE)) {
                    // 00EE: RET
                    this.pc = this.stack.pop() + 2;
                } else {
                    throw opcode + ' not handled';
                }
                break;
            }
            case 0x1: {
                // 1nnn: JP addr
                this.pc = opcode.nnn;
                break;
            }
            case 0x2: {
                // 2nnn: CALL addr
                this.stack.push(this.pc);
                this.pc = opcode.nnn;
                break;
            }
            case 0x3: {
                // 3xnn: SE Vx, byte
                const vx = this.registers[opcode.vx];
                this.pc += vx == opcode.nn ? 4 : 2;
                break;
            }
            case 0x4: {
                // 4xnn: SNE Vx, byte
                const vx = this.registers[opcode.vx];
                this.pc += vx != opcode.nn ? 4 : 2;
                break;
            }
            case 0x5: {
                // 5xy0: SE Vx, Vy
                const vx = this.registers[opcode.vx];
                const vy = this.registers[opcode.vy];
                this.pc += vx == vy ? 4 : 2;
                break;
            }
            case 0x6: {
                // 6xnn: LD Vx, byte
                this.registers[opcode.vx] = opcode.nn;
                this.pc += 2;
                break;
            }
            case 0x7: {
                // 7xnn: ADD Vx, byte
                const newValue = this.registers[opcode.vx] + opcode.nn;
                this.registers[opcode.vx] = newValue & 0xFF;
                this.pc += 2;
                break;
            }
            case 0x8: {
                const vx = this.registers[opcode.vx];
                const vy = this.registers[opcode.vy];

                switch(opcode.get(3)) {
                    case 0x0: {
                        // 8xy0: LD Vx, Vy
                        this.registers[opcode.vx] = vy;
                        this.pc += 2;
                        break;
                    }
                    case 0x1: {
                        // 8xy1: OR Vx, Vy
                        this.registers[opcode.vx] = (vx | vy) & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    case 0x2: {
                        // 8xy2: AND Vx, Vy
                        this.registers[opcode.vx] = (vx & vy) & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    case 0x3: {
                        // 8xy3: XOR Vx, Vy
                        this.registers[opcode.vx] = (vx ^ vy) & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    case 0x4: {
                        // 8xy4: ADD Vx, Vy
                        const newValue = vx + vy;
                        this.registers[0x0F] = newValue > 0xFF ? 1 : 0;
                        this.registers[opcode.vx] = newValue & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    case 0x5: {
                        // 8xy5: SUB Vx, Vy
                        const newValue = vx - vy;
                        this.registers[0x0F] = newValue < 0 ? 0 : 1;
                        this.registers[opcode.vx] = newValue & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    case 0x6: {
                        // 8xy6: SHR Vx, Vy
                        const leastSignificantBit = vy & 0x01;
                        this.registers[0x0F] = leastSignificantBit;
                        this.registers[opcode.vx] = vy >> 1;
                        this.pc += 2;
                        break;
                    }
                    case 0x7: {
                        // 8xy7: SUBN Vx, Vy
                        const newValue = vy - vx;
                        this.registers[0x0F] = newValue < 0 ? 0 : 1;
                        this.registers[opcode.vx] = newValue & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    case 0xE: {
                        // 8xyE: SHL Vx, Vy
                        const mostSignificantBit = (vy & 0x8000) >> 15;
                        this.registers[0x0F] = mostSignificantBit;
                        this.registers[opcode.vx] = (vy << 1) & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    default: {
                        throw opcode + ' not handled';
                    }
                }
                break;
            }
            case 0x9: {
                if (opcode.get(3) != 0x0)
                    throw opcode + ' not handled';

                // 9xy0: SNE Vx, Vy

                const vx = this.registers[opcode.vx];
                const vy = this.registers[opcode.vy];

                this.pc += vx != vy ? 4 : 2;
                break;
            }
            case 0xA: {
                // Annn: LD I, addr
                this.i = opcode.nnn;
                this.pc += 2;
                break;
            }
            case 0xB: {
                // Bnnn: JP V0, addr
                this.i = opcode.nnn + this.registers[0x0];
                this.pc += 2;
                break;
            }
            case 0xC: {
                // Cxnn: RND Vx, byte
                this.registers[opcode.vx] = Math.floor(Math.random() * (0x100)) & opcode.nn;
                this.pc += 2;
                break;
            }
            case 0xD: {
                // Dxyn: Vx, Vy, n
                const x = this.registers[opcode.vx];
                const y = this.registers[opcode.vy];
                const bytes = opcode.n;
                let flip = false;

                for (let i = 0; i < bytes; i++) {
                    const yPos = y + i;
                    if (yPos >= 32) 
                        break;

                    const line = this.mem[this.i + i];
                    const bits = line.toString(2)
                        .padStart(8, '0')
                        .split('')
                        .map((v) => parseInt(v));

                    for (let j = 0; j < bits.length; j++) {
                        const xPos = x + j;
                        if (xPos >= 64)
                            break;

                        const index = (yPos * 64) + xPos;
                        const newValue = this.gfx[index] ^ bits[j];
                        if (this.gfx[index] == 1 && newValue == 0)
                            flip = true;

                        this.gfx[index] = newValue;
                        if(newValue == 1)
                            this.display.fillCell(xPos, yPos);
                        else
                            this.display.clearCell(xPos, yPos);
                    }
                }
                this.registers[0xF] = flip ? 1 : 0;
                this.pc += 2;
                break;
            }
            case 0xE: {
                const vx = this.registers[opcode.vx];
                const isPressed = this.keyboard.isPressed(vx);
                switch (opcode.nn) {
                    case 0x9E:
                        // Ex9E: SKP Vx
                        this.pc += isPressed ? 4 : 2;
                        break;
                    case 0xA1:
                        // ExA1: SKNP Vx
                        this.pc += isPressed ? 2 : 4;
                        break;
                    default:
                        throw opcode + ' not handled';
                }
                break;
            }
            case 0xF: {
                switch (opcode.nn) {
                    case 0x07: {
                        // Fx07: LD Vx, DT
                        this.registers[opcode.vx] = this.delay & 0xFF;
                        this.pc += 2;
                        break;
                    }
                    case 0x0A: {
                        // Fx0A: LD Vx, K
                        this.waitingForRegister = opcode.vx;
                        this.isWaitingForKey = true;
                        break;
                    }
                    case 0x15: {
                        // Fx15: LD DT, Vx
                        this.delay = this.registers[opcode.vx];
                        this.pc += 2;
                        break;
                    }
                    case 0x18: {
                        // Fx18: LD ST, Vx
                        this.sound = this.registers[opcode.vx];
                        this.pc += 2;
                        break;
                    }
                    case 0x1E: {
                        // Fx1E: ADD I, Vx
                        this.i += this.registers[opcode.vx];
                        this.pc += 2;
                        break;
                    }
                    case 0x29: {
                        // Fx29: LD F, Vx
                        this.i = this.registers[opcode.vx] * 5;
                        this.pc += 2;
                        break;
                    }
                    case 0x33: {
                        // Fx33: LD B, Vx
                        const vx = this.registers[opcode.vx];
                        const hundreds = Math.floor(vx / 100);
                        const tens = Math.floor(vx / 10) % 10;
                        const ones = vx % 10;
                        this.mem[this.i] = hundreds;
                        this.mem[this.i + 1] = tens;
                        this.mem[this.i + 2] = ones;
                        this.pc += 2;
                        break;
                    }
                    case 0x55: {
                        // Fx55: LD I, Vx
                        const vx = opcode.vx;
                        for (let i = 0; i <= vx; i++) {
                            const register = this.registers[i];
                            this.mem[this.i + i] = register;
                        }
                        this.pc += 2;
                        break;
                    }
                    case 0x65: {
                        // Fx65: LD Vx, I
                        const vx = opcode.vx;
                        for (let i = 0; i <= vx; i++) {
                            const value = this.mem[this.i + i];
                            this.registers[i] = value;
                        }
                        this.pc += 2;
                        break;
                    }
                    default:
                        throw opcode + 'not handled';
                }
                break;
            }
            default: {
                throw opcode + ' not handled';
            }
        }
    }
}

export default Cpu;
