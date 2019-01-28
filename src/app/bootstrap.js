import jss from 'jss';
import preset from 'jss-preset-default';

import romsClient from 'chip8/app/clients/roms.js';
import attachInput from 'chip8/app/input.js';
import subscribeCpu from 'chip8/app/subscribers/cpu.js';
import subscribeRoms from 'chip8/app/subscribers/roms.js';
import { setRoms } from 'chip8/app/actions/roms.js';


const setupStyles = () => {
    jss.setup(preset());
    jss.createStyleSheet({
        '@global': {
            'body, html': {
                backgroundColor: '#3f3f3f',
                padding: 0,
                margin: 0,
                fontFamily: ['VT323', 'monospace'],
            },
        }
    }).attach();
};

const populateRoms = (store) => {
    romsClient.listRoms().then((roms) => {
        store.dispatch(setRoms(roms));
    }).catch((err) => {
        alert(err);
    });
};

const bootstrap = (target, store) => {
    setupStyles();
    attachInput(target, store);
    subscribeCpu(store);
    subscribeRoms(store);
    populateRoms(store);
};

export default bootstrap;