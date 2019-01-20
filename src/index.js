import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import jss from 'jss';
import preset from 'jss-preset-default';
import App from 'chip8/components/App';
import store from 'chip8/app/store.js';
import {onKeyDown, onKeyUp} from 'chip8/app/listeners/keys.js';
import {initialize, tick, decrementCounters} from 'chip8/app/actions/cpu.js';
import '../pong.rom';

jss.setup(preset());
jss.createStyleSheet({
    '@global': {
        body: {
            backgroundColor: '#596275',
            padding: 0,
            margin: 0
        }
    }
}).attach();

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
setInterval(() => store.dispatch(decrementCounters()), 1000/60);

fetch('/roms/pong.rom').then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
        const vi = new Uint8Array(arrayBuffer);
        store.dispatch(initialize({
            data: vi
        }));
        setInterval(() => store.dispatch(tick()), 1000/500);
    });

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'));