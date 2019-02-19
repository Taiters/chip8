const getDefaultCpuState = () => ({
    running: false,
    i: 0,
    pc: 0x200,
    delay: 0,
    sound: 0,
    keys: Array(16).fill(0),
    gfx: new Array(2048).fill(0),
    mem: new Uint8Array(4096),
    registers: new Uint8Array(16),
    stack: [],
    drawFlag: false,
    clearFlag: false,
    waitKeyFlag: false,
    waitKeyRegister: null,
});

const getDefaultRomsState = () => ({
    list: [],
    current: null,
});

const getDefaultEditorState = () => ({
    focused: false,
    src: '',
});

const getDefaultSidePanelState = () => ({
    view: 'list'
});

const getDefaultState = () => ({
    roms: getDefaultRomsState(),
    cpu: getDefaultCpuState(),
    editor: getDefaultEditorState(),
    sidePanel: getDefaultSidePanelState(),
});

export {
    getDefaultRomsState,
    getDefaultCpuState,
    getDefaultEditorState,
    getDefaultState,
};