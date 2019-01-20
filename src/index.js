import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import jss from 'jss';
import preset from 'jss-preset-default';
import App from 'chip8/components/App';
import store from 'chip8/app/store.js';
import {onKeyDown, onKeyUp} from 'chip8/app/listeners/keys.js';

jss.setup(preset());
jss.createStyleSheet({
    '@global': {
        body: {
            backgroundColor: 'grey',
            padding: 0,
            margin: 0
        }
    }
}).attach();

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'));