import jss from 'jss';
import preset from 'jss-preset-default';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import romsClient from 'chip8/app/clients/roms.js';
import attachInput from 'chip8/app/input.js';
import subscribeCpu from 'chip8/app/subscribers/cpu.js';
import subscribeRoms from 'chip8/app/subscribers/roms.js';
import firebaseConfig from 'chip8/config/firebase.js';
import { setRoms } from 'chip8/app/actions/roms.js';


const initFirebase = () => {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().signInAnonymously().catch((err) => {
        alert(err.message);
    });

    window.firebase = firebase;
};

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
    });
};

const bootstrap = (target, store) => {
    initFirebase();
    setupStyles();
    attachInput(target, store);
    subscribeCpu(store);
    subscribeRoms(store);
    populateRoms(store);
};

export default bootstrap;