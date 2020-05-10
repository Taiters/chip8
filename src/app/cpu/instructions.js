const Instructions = {
    CLS: (cpu) => {
        cpu.gfx = new Array(64 * 32);
        cpu.gfx.fill(0);
        cpu.pc += 2;
    },

    RET: (cpu) => {
        if (cpu.sp === 0)
            throw 'Stack is empty';

        cpu.pc = cpu.stack[--cpu.sp] + 2;
    },

    JP_ADDRESS: (cpu, opcode) => {
        cpu.pc = opcode.nnn;
    },

    CALL_ADDRESS: (cpu, opcode) => {
        if (cpu.sp > 16)
            throw 'Stack overflow';
        
        cpu.stack[cpu.sp++] = cpu.pc;
        cpu.pc = opcode.nnn;
    },

    SE_REGISTER_BYTE: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        cpu.pc += vx == opcode.nn ? 4 : 2;
    },

    SNE_REGISTER_BYTE: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        cpu.pc += vx != opcode.nn ? 4 : 2;
    },

    SE_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        cpu.pc += vx == vy ? 4 : 2;
    },

    LD_REGISTER_BYTE: (cpu, opcode) => {
        cpu.registers[opcode.x] = opcode.nn;
        cpu.pc += 2;
    },

    ADD_REGISTER_BYTE: (cpu, opcode) => {
        const newValue = cpu.registers[opcode.x] + opcode.nn;
        cpu.registers[opcode.x] = newValue & 0xFF;
        cpu.pc += 2;
    },

    LD_REGISTER_REGISTER: (cpu, opcode) => {
        cpu.registers[opcode.x] = cpu.registers[opcode.y];
        cpu.pc += 2;
    },

    OR_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        cpu.registers[opcode.x] = (vx | vy) & 0xFF;
        cpu.pc += 2;
    },

    AND_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        cpu.registers[opcode.x] = (vx & vy) & 0xFF;
        cpu.pc += 2;
    },

    XOR_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        cpu.registers[opcode.x] = (vx ^ vy) & 0xFF;
        cpu.pc += 2;
    },

    ADD_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        const newValue = vx + vy;
        cpu.registers[0x0F] = newValue > 0xFF ? 1 : 0;
        cpu.registers[opcode.x] = newValue & 0xFF;
        cpu.pc += 2;
    },

    SUB_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        const newValue = vx - vy;
        cpu.registers[0x0F] = newValue < 0 ? 0 : 1;
        cpu.registers[opcode.x] = newValue & 0xFF;
        cpu.pc += 2;
    },

    SHR_REGISTER_REGISTER: (cpu, opcode) => {
        const vy = cpu.registers[opcode.y];
        cpu.registers[0x0F] = vy & 1;
        cpu.registers[opcode.x] = vy >> 1;
        cpu.pc += 2;
    },

    SUBN_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        const newValue = vy - vx;
        cpu.registers[0x0F] = newValue < 0 ? 0 : 1;
        cpu.registers[opcode.x] = newValue & 0xFF;
        cpu.pc += 2;
    },

    SHL_REGISTER_REGISTER: (cpu, opcode) => {
        const vy = cpu.registers[opcode.y];
        cpu.registers[0x0F] = (vy & 128) >> 7;
        cpu.registers[opcode.x] = (vy << 1) & 0xFF;
        cpu.pc += 2;
    },

    SNE_REGISTER_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        cpu.pc += vx != vy ? 4 : 2;
    },

    LD_I_ADDRESS: (cpu, opcode) => {
        cpu.i = opcode.nnn;
        cpu.pc += 2;
    },

    JP_REGISTER_ADDRESS: (cpu, opcode) => {
        cpu.pc = opcode.nnn + cpu.registers[0];
    },

    RND_REGISTER_BYTE: (cpu, opcode) => {
        cpu.registers[opcode.x] = Math.floor(Math.random() * 256) & opcode.nn;
        cpu.pc += 2;
    },

    DRW_REGISTER_REGISTER_NIBBLE: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const vy = cpu.registers[opcode.y];
        const bytes = opcode.n;

        cpu.registers[0xF] = 0;
        for (let i = 0; i < bytes; i++) {
            const y = vy + i;
            if (y >= 32) 
                break;

            let line = cpu.memory[cpu.i + i];
            for (let j = 0; j < 8; j++) {
                const x = vx + (7-j);
                const bit = line & 1;
                const index = y * 64 + x;
                const current = cpu.gfx[index];

                if (current === 1 && bit === 1)
                    cpu.registers[0xF] = 1;
                
                cpu.gfx[index] = current ^ bit;

                line = line >> 1;
            }
        }

        cpu.pc += 2;
    },

    SKP_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        cpu.pc += cpu.keys[vx] ? 4 : 2;
    },

    SKNP_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        cpu.pc += cpu.keys[vx] ? 2 : 4;
    },

    LD_REGISTER_DT: (cpu, opcode) => {
        cpu.registers[opcode.x] = cpu.delayTimer & 0xFF;
        cpu.pc += 2;
    },

    LD_REGISTER_KEY: (cpu, opcode) => {
        cpu.blocked = true;
        cpu.keyCallback = (key) => {
            cpu.registers[opcode.x] = key;
            cpu.blocked = false;
            cpu.pc += 2;
        };
    },

    LD_DT_REGISTER: (cpu, opcode) => {
        cpu.delayTimer = cpu.registers[opcode.x];
        cpu.pc += 2;
    },

    LD_ST_REGISTER: (cpu, opcode) => {
        cpu.soundTimer = cpu.registers[opcode.x];
        cpu.pc += 2;
    },

    ADD_I_REGISTER: (cpu, opcode) => {
        cpu.i += cpu.registers[opcode.x];
        cpu.pc += 2;
    },

    LD_F_REGISTER: (cpu, opcode) => {
        cpu.i = cpu.registers[opcode.x] * 5;
        cpu.pc += 2;
    },

    LD_B_REGISTER: (cpu, opcode) => {
        const vx = cpu.registers[opcode.x];
        const hundreds = Math.floor(vx / 100);
        const tens = Math.floor(vx / 10) % 10;
        const ones = vx % 10;
        cpu.memory[cpu.i] = hundreds;
        cpu.memory[cpu.i + 1] = tens;
        cpu.memory[cpu.i + 2] = ones;
        cpu.pc += 2;
    },

    LD_I_REGISTER: (cpu, opcode) => {
        const x = opcode.x;
        for (let i = 0; i <= x; i++) {
            const register = cpu.registers[i];
            cpu.memory[cpu.i + i] = register;
        }
        // TODO: Double check this step
        cpu.i = cpu.i + x + 1;
        cpu.pc += 2;
    },

    LD_REGISTER_I: (cpu, opcode) => {
        const x = opcode.x;
        for (let i = 0; i <= x; i++) {
            const value = cpu.memory[cpu.i + i];
            cpu.registers[i] = value;
        }
        cpu.i = cpu.i + x + 1;
        cpu.pc += 2;
    }
};


export default Instructions;