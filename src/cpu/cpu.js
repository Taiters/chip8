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
        console.log(this.pc + ': ' + opcode); //eslint-disable-line no-console
        switch(opcode.get(0)) {
            case 0x0: {
                if (opcode.equals(0x00E0)) {
                    // 00E0: CLS
                    // TODO: hook up gfx
                    this.pc += 2;
                } else if (opcode.equals(0x00EE)) {
                    // 00EE: RET
                    this.pc = this.stack.pop();
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
                // TODO: More gfx
                this.pc += 2;
                break;
            }
            default: {
                throw opcode + ' not handled';
            }
        }
    }
}

export default Cpu;
