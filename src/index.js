/*
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from 'chip8/components/App';
import store from 'chip8/app/store.js';
import bootstrap from 'chip8/app/bootstrap.js';


bootstrap(window, store);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'));
*/

import React from 'react';
import ReactDOM from 'react-dom';

import Terminal from 'chip8/components/Terminal';


const openingMessages = [
    'CHIP-8 v0.0.1',
    'Hello, welcome to CHIP-8. This does nothing. Have fun',
    'I\'d say type help, but that also does nothing',
    '\u00a0'
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: openingMessages,
        };

        this.handleInput = this.handleInput.bind(this);
    }

    outputMessage(message) {
        this.setState((state) => ({
            messages: [...state.messages, message]
        }));
    }

    handleInput(value) {
        this.outputMessage('> ' + value);

        if (value.trim().toLowerCase() == 'hello') {
            this.outputMessage('Hello! Welcome to CHIP-8. Which does nothing at the moment');
        } else {
            this.outputMessage('Unrecognized command: ' + value);
        }
        this.outputMessage('\u00a0');
    }

    render() {
        return (
            <Terminal messages={this.state.messages} onInput={this.handleInput} />
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app'));