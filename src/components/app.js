import React from 'react'; // eslint-disable-line no-unused-vars
import Header from 'chip8/components/header.js'; // eslint-disable-line no-unused-vars
import Screen from 'chip8/components/screen.js'; // eslint-disable-line no-unused-vars
import Debugger from 'chip8/components/debugger.js'; // eslint-disable-line no-unused-vars

import styles from 'chip8/styles/app.scss';

function getCpuState(cpu) {
    return {
        pc: cpu.pc,
        i: cpu.i,
        delay: cpu.delay,
        sound: cpu.sound,
        registers: cpu.registers
    };
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cpu: getCpuState(this.props.cpu),
            rom: null,
            running: false,
        };
        this.handleRomLoaded = this.handleRomLoaded.bind(this);
        this.run = this.run.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);
        this.tick = this.tick.bind(this);
    }

    handleRomLoaded(rom) {
        this.stopInterval();
        this.props.cpu.load(rom.data);
        this.setState({
            running: false,
            rom: rom,
            cpu: getCpuState(this.props.cpu),
        });
    }

    run() {
        this.stopInterval();
        this.setState({running: true});
        this.cpuInterval = setInterval(this.tick, 1000/500);
    }

    pause() {
        this.stopInterval();
        this.setState({running: false});
    }

    stop() {
        this.stopInterval();
        this.props.cpu.load(this.state.rom.data);
        this.setState({
            cpu: getCpuState(this.props.cpu),
            running: false,
        });
    }

    stopInterval() {
        if (this.cpuInterval != null) {
            clearInterval(this.cpuInterval);
        }
    }

    tick() {
        this.props.cpu.tick();
        this.setState({cpu: getCpuState(this.props.cpu)});
    }

    render() {
        return (
            <React.Fragment>
                <Header onRomLoaded={this.handleRomLoaded}/>
                <div className={styles.container}>
                    <Debugger
                        rom={this.state.rom}
                        cpu={this.state.cpu}
                        running={this.state.running}
                        onRun={this.run}
                        onPause={this.pause}
                        onStop={this.stop}
                        onStep={this.tick}/>
                    <Screen 
                        display={this.props.cpu.display} />
                </div>
            </React.Fragment>
        );
    }
}

export default App;
