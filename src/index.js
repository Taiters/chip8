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


const WELCOME_MESSAGE = `CHIP-8 v0.0.1
Welcome to CHIP-8. This currently does nothing useful. Be patient.

There is also a help command\n
`;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.handleCommand = this.handleCommand.bind(this);
    }

    handleCommand(command, args, output, done) {
        try {
            switch (command.toLowerCase()) {
                case 'help':
                    output('Available commands:');
                    output('    sleep <period_in_ms>: Make this sleep for <period_in_ms>');
                    done();
                    break;
                case 'sleep':
                    output(`Sleeping for ${args[0]}ms...`);
                    setTimeout(done, parseInt(args[0]));
                    break;
                default:
                    done(`Unrecognized command: ${command}`);
            }
        } catch(error)  {
            done(error);
        }
    }

    render() {
        return (
            <Terminal onCommand={this.handleCommand} message={WELCOME_MESSAGE} />
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app'));