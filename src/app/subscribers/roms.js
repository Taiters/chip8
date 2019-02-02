import { toast } from 'react-toastify';

import romsClient from 'chip8/app/clients/roms.js';
import { initialize, play } from 'chip8/app/actions/cpu.js';


const subscribe = (store) => {
    let currentRom = store.getState().roms.current;
    store.subscribe(() => {
        let previousRom = currentRom;
        const state = store.getState();
        currentRom = state.roms.current;

        if (previousRom == currentRom)
            return;
        
        const selectedRom = state.roms.list[currentRom];
        romsClient.downloadRom(selectedRom.path).then((data) => {
            store.dispatch(initialize(data));
            store.dispatch(play());
        }).catch((err) => {
            console.error(err); // eslint-disable-line no-console
            toast.error('Could not download ROM');
        });
    });
};

export default subscribe;