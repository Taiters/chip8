import jss from 'jss';
import preset from 'jss-preset-default';
import * as firebase from 'firebase/app';
import { toast } from 'react-toastify';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import romsClient from 'chip8/app/clients/roms.js';
import attachInput from 'chip8/app/input.js';
import subscribeCpu from 'chip8/app/subscribers/cpu.js';
import subscribeRoms from 'chip8/app/subscribers/roms.js';
import firebaseConfig from 'chip8/config/firebase.js';
import { setRoms } from 'chip8/app/actions/roms.js';

const bootstrap = (target, store) => {
    jss.setup(preset());
    jss.createStyleSheet({
        '@global': {
            'body, html': {
                backgroundColor: '#3f3f3f',
                padding: 0,
                margin: 0,
                fontFamily: ['VT323', 'monospace'],
                height: '100%',
            },
            '#app': {
                height: '100%',
            }
        }
    }).attach();

    firebase.initializeApp(firebaseConfig);
    firebase.auth().signInAnonymously()
        .then(() => romsClient.listRoms())
        .then((roms) => store.dispatch(setRoms(roms)))
        .catch((err) => {
            console.error(err); // eslint-disable-line no-console
            toast.error('Could not access ROMs');
        });

    attachInput(target, store);
    subscribeCpu(store);
    subscribeRoms(store);
};

export default bootstrap;