import Cpu from './cpu';
import Instructions from './instructions';


const cpu = Cpu.builder()
    .addInstruction(0x00E0, 0xFFFF, Instructions.CLS)
    .addInstruction(0x00EE, 0xFFFF, Instructions.RET)
    .addInstruction(0x1000, 0xF000, Instructions.JP_ADDRESS)
    .addInstruction(0x2000, 0xF000, Instructions.CALL_ADDRESS)
    .addInstruction(0x3000, 0xF000, Instructions.SE_REGISTER_BYTE)
    .addInstruction(0x4000, 0xF000, Instructions.SNE_REGISTER_BYTE)
    .addInstruction(0x5000, 0xF00F, Instructions.SE_REGISTER_REGISTER)
    .addInstruction(0x6000, 0xF000, Instructions.LD_REGISTER_BYTE)
    .addInstruction(0x7000, 0xF000, Instructions.ADD_REGISTER_BYTE)
    .addInstruction(0x8000, 0xF00F, Instructions.LD_REGISTER_REGISTER)
    .addInstruction(0x8001, 0xF00F, Instructions.OR_REGISTER_REGISTER)
    .addInstruction(0x8002, 0xF00F, Instructions.AND_REGISTER_REGISTER)
    .addInstruction(0x8003, 0xF00F, Instructions.XOR_REGISTER_REGISTER)
    .addInstruction(0x8004, 0xF00F, Instructions.ADD_REGISTER_REGISTER)
    .addInstruction(0x8005, 0xF00F, Instructions.SUB_REGISTER_REGISTER)
    .addInstruction(0x8006, 0xF00F, Instructions.SHR_REGISTER_REGISTER)
    .addInstruction(0x8007, 0xF00F, Instructions.SUBN_REGISTER_REGISTER)
    .addInstruction(0x800E, 0xF00F, Instructions.SHL_REGISTER_REGISTER)
    .addInstruction(0x9000, 0xF00F, Instructions.SNE_REGISTER_REGISTER)
    .addInstruction(0xA000, 0xF000, Instructions.LD_I_ADDRESS)
    .addInstruction(0xB000, 0xF000, Instructions.JP_REGISTER_ADDRESS)
    .addInstruction(0xC000, 0xF000, Instructions.RND_REGISTER_BYTE)
    .addInstruction(0xD000, 0xF000, Instructions.DRW_REGISTER_REGISTER_NIBBLE)
    .addInstruction(0xE09E, 0xF0FF, Instructions.SKP_REGISTER)
    .addInstruction(0xE0A1, 0xF0FF, Instructions.SKNP_REGISTER)
    .addInstruction(0xF007, 0xF0FF, Instructions.LD_REGISTER_DT)
    .addInstruction(0xF00A, 0xF0FF, Instructions.LD_REGISTER_KEY)
    .addInstruction(0xF015, 0xF0FF, Instructions.LD_DT_REGISTER)
    .addInstruction(0xF018, 0xF0FF, Instructions.LD_ST_REGISTER)
    .addInstruction(0xF01E, 0xF0FF, Instructions.ADD_I_REGISTER)
    .addInstruction(0xF029, 0xF0FF, Instructions.LD_F_REGISTER)
    .addInstruction(0xF033, 0xF0FF, Instructions.LD_B_REGISTER)
    .addInstruction(0xF055, 0xF0FF, Instructions.LD_I_REGISTER)
    .addInstruction(0xF065, 0xF0FF, Instructions.LD_REGISTER_I)
    .build();


export {
    cpu
};