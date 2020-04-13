import React from 'react';
import PropTypes from 'prop-types';

import Terminal from 'chip8/components/Terminal';


const parseCommand = (value) => {
    const parts = value.trim().split(/\s+/);
    return {
        command: parts[0].toLowerCase(),
        args: parts.slice(1),
    };
};

const help = (app, _, done) => {
    app.echo('Available commands');
    app.echo(' ');
    for (const [name, cmd] of Object.entries(app.commands)) {
        app.echo(`  - ${name}:`);
        app.echo(`      description: ${cmd.description}`);
        if (cmd.usage) {
            app.echo(`      usage: ${cmd.usage}`);
        }
    }

    done();
};

const sleep = (app, args, done) => {
    if (args.length != 1) {
        done('Unexpected arguments');
        return;
    }

    const sleepMs = parseInt(args[0]);
    if (isNaN(sleepMs)) {
        done('Invalid number');
        return;
    }

    app.echo(`Sleeping for ${sleepMs}ms...`);
    setTimeout(() => {
        app.echo('Finished');
        done();
    }, sleepMs);
};

const countdown = (app, args, done) => {
    if (args.length != 1) {
        done('Unexpected arguments');
        return;
    }

    const countdown = parseInt(args[0]);
    if (isNaN(countdown)) {
        done('Invalid number');
        return;
    }
    app.echo('Starting countdown');
    app.setState({
        countdown,
        onCountdownComplete: () => {
            app.setState({
                countdown: 0,
            });
            app.echo('Finished');
            done();
        }
    });
};

class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRemaining: parseInt(props.duration)
        };
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.timeRemaining < 1) {
                clearInterval(this.interval);
                this.props.onComplete();
                return;
            }
            this.setState((state) => ({
                timeRemaining: state.timeRemaining - 1
            }));
        }, 1000);
    }

    render() {
        return (
            <pre>{this.state.timeRemaining}</pre>
        );
    }
}

Countdown.propTypes = {
    duration: PropTypes.number.isRequired,
    onComplete: PropTypes.func.isRequired,
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            output: [],
            requestInput: true,
            countdown: 0,
        };

        this.commands = {
            help: {
                description: 'List available commands',
                run: help,
            },
            sleep: {
                description: 'Sleep for <value> milliseconds',
                usage: 'sleep <value>',
                run: sleep,
            },
            countdown: {
                description: 'Do a countdown',
                usage: 'countdown <seconds>',
                run: countdown,
            },
        };

        this.terminal = React.createRef();
        this.handleInput = this.handleInput.bind(this);
    }

    echo(...value) {
        this.setState((state) => ({
            output: [...state.output, ...value],
        }));
    }

    setRequestInput(value) {
        this.setState({
            requestInput: value,
        });
    }

    handleInput(value) {
        const {command, args} = parseCommand(value);
        this.echo(`> ${value}`);

        if (this.commands.hasOwnProperty(command)) {
            this.setRequestInput(false);
            const cmd = this.commands[command];
            cmd.run(this, args, (err) => {
                if (err) {
                    this.echo(
                        `Error: ${err}`,
                        `Usage: ${cmd.usage}`);
                }

                this.setRequestInput(true);
                this.echo(' ');
            });
        } else {
            this.echo(`Unrecognized command: ${command}`, ' ');
        }
    }

    componentDidMount() {
        const terminal = this.terminal;
        window.addEventListener('click', () => {
            if (terminal.current)
                terminal.current.focus();
        });

        this.echo(
            'Welcome to CHIP-8',
            'Not much happening here',
            ' ',
            'Type "help" to view available commands',
            ' '
        );
    }

    render() {
        if (this.state.countdown > 0) {
            return (
                <Countdown 
                    duration={this.state.countdown}
                    onComplete={this.state.onCountdownComplete} />
            );
        }
        return (
            <Terminal 
                output={this.state.output}
                requestInput={this.state.requestInput}
                onInput={this.handleInput}
                ref={this.terminal}/>
        );
    }
}

export default App;