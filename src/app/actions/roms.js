export const SET_ROMS = 'SET_ROMS';
export const SELECT_ROM = 'SELECT_ROM';


export const setRoms = (roms) => ({
    type: SET_ROMS,
    roms
});

export const selectRom = (index) => ({
    type: SELECT_ROM,
    index
});