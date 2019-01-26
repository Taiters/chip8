import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from 'chip8/components/App';
import store from 'chip8/app/store.js';
import bootstrap from 'chip8/app/bootstrap.js';


bootstrap(store);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'));