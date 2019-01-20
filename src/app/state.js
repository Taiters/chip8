const getDefaultRomState = () => ({
    romLoaded: false,
    name: null,
    data: null
});

const getDefaultCpuState = () => ({
    running: false,
    i: 0,
    pc: 0x200,
    delay: 0,
    sound: 0,
    keys: Array(16).fill(0),
    gfx: new Array(2048),
    mem: new Uint8Array(4096),
    registers: new Uint8Array(16),
    stack: [],
    drawFlag: false,
    clearFlag: false,
    waitKeyFlag: false,
    waitKeyRegister: null,
});

const getDefaultState = () => ({
    rom: getDefaultRomState(),
    cpu: getDefaultCpuState()
});

export {
    getDefaultRomState,
    getDefaultCpuState,
    getDefaultState,
};