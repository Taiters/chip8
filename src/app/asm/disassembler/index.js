import Opcode from "chip8/app/cpu/opcode";

class DisassemblerOutput {
    constructor() {
        this.lines = {};
        this.labels = {};
        this.labelCount = 0;
    }

    add(line, addr) {
        if (Array.isArray(line)) {
            for (let i = 0; i <= line.length; i++) {
                this.lines[addr + i] = line[i];
            }
        } else {
            this.lines[addr] = line;
        }
    }

    getAddrLabel(addr) {
        if (!(addr in this.labels)) {
            const label = `label_${this.labelCount}`;
            this.labelCount += 1;
            this.labels[addr] = label;
        }
        return this.labels[addr];
    }

    build() {
        return Object.keys(this.lines).map(parseInt).sort().flatMap(address => {
            if (address in this.labels) {
                return [
                    '',
                    `${this.labels[address]}:`,
                    this.lines[address],
                ];
            }
            return this.lines[address];
        });
    }
}

const register = (val) => `v${val.toString(16).toUpperCase()}`;
const xnn = (opcode) => `${register(opcode.x)}, ${opcode.nn}`;
const x = (opcode) => `${register(opcode.x)}`;
const xy = (opcode) => `${x(opcode)}, ${register(opcode.y)}`;
const xyn = (opcode) => `${xy(opcode)}, ${opcode.n}`;
const binary = (opcode) => [
    `0b${((opcode.value >> 8) & 0xFF).toString(2).padStart(8, '0')}`,
    `0b${(opcode.value & 0xFF).toString(2).padStart(8, '0')}`
];

// 8XY(?)
const getLineForRegisterOps = (opcode) => {
    switch (opcode.value & 0x000F) {
        case 0x0000: return `LD ${xy(opcode)}`;
        case 0x0001: return `OR ${xy(opcode)}`;
        case 0x0002: return `AND ${xy(opcode)}`;
        case 0x0003: return `XOR ${xy(opcode)}`;
        case 0x0004: return `ADD ${xy(opcode)}`;
        case 0x0005: return `SUB ${xy(opcode)}`;
        case 0x0006: return `SHR ${xy(opcode)}`;
        case 0x0007: return `SUBN ${xy(opcode)}`;
        case 0x000E: return `SHL ${xy(opcode)}`;
        default: return binary(opcode);
    }
}

// FX(??)
const getLineForFXOpcode = (opcode) => {
    switch (opcode.value & 0x00FF) {
        case 0x0007: return `LD ${x(opcode)}, DT`;
        case 0x000A: return `LD ${x(opcode)}, K`;
        case 0x0015: return `LD DT, ${x(opcode)}`;
        case 0x0018: return `LD ST, ${x(opcode)}`;
        case 0x001E: return `ADD I, ${x(opcode)}`;
        case 0x0029: return `LD F, ${x(opcode)}`;
        case 0x0033: return `LD B, ${x(opcode)}`;
        case 0x0055: return `LD I, ${x(opcode)}`;
        case 0x0065: return `LD ${x(opcode)}, I`;
        default: return binary(opcode);
    }
}

export const disassemble = (rom) => {
    const lines = new DisassemblerOutput();
    let offset = 0;

    // Not dealing with misalignments for now, so if
    // the address isn't something we can use as a label,
    // we'll just print the binary.
    const getAddrLabel = (prefix, opcode) => {
        const addr = opcode.nnn;
        if (addr % 2 !== 0 || addr < 0x200 || addr >= (rom.length + 0x200)) {
            return binary(opcode)
        }

        return `${prefix} ${lines.getAddrLabel(addr)}`;
    }

    while (offset < rom.length) {
        const addr = offset + 0x200;
        const firstByte = rom[offset];
        if (offset + 1 >= rom.length) {
            lines.add(`0b${firstByte.toString(2).padStart(8, '0')}`, addr);
            break;
        }

        const secondByte = rom[offset + 1];
        const opcode = new Opcode((firstByte << 8) | secondByte);
        if ((opcode.value & 0xFFFF) == 0x00E0) {
            lines.add("CLS", addr);
        }
        else if ((opcode.value & 0xFFFF) == 0x00EE) {
            lines.add("RET", addr);
        }
        else if ((opcode.value & 0xF000) == 0x1000) {
            lines.add(getAddrLabel('JP', opcode), addr);
        }
        else if ((opcode.value & 0xF000) == 0x2000) {
            lines.add(getAddrLabel('CALL', opcode), addr);
        }
        else if ((opcode.value & 0xF000) == 0x3000) {
            lines.add(`SE ${xnn(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF000) == 0x4000) {
            lines.add(`SNE ${xnn(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF00F) == 0x5000) {
            lines.add(`SE ${xy(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF000) == 0x6000) {
            lines.add(`LD ${xnn(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF000) == 0x7000) {
            lines.add(`ADD ${xnn(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF000) == 0x8000) {
            lines.add(getLineForRegisterOps(opcode), addr);
        }
        else if ((opcode.value & 0xF00F) == 0x9000) {
            lines.add(`SNE ${xy(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF000) == 0xA000) {
            lines.add(getAddrLabel('LD I,', opcode), addr);
        }
        else if ((opcode.value & 0xF000) == 0xB000) {
            lines.add(getAddrLabel('JP v0,', opcode), addr);
        }
        else if ((opcode.value & 0xF000) == 0xC000) {
            lines.add(`RND ${xnn(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF000) == 0xD000) {
            lines.add(`DRW ${xyn(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF0FF) == 0xE09E) {
            lines.add(`SKP ${x(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF0FF) == 0xE0A1) {
            lines.add(`SKNP ${x(opcode)}`, addr);
        }
        else if ((opcode.value & 0xF000) == 0xF000) {
            lines.add(getLineForFXOpcode(opcode), addr);
        } else {
            lines.add(binary(opcode), addr);
        }
        offset += 2;
    }

    return lines.build();
}
