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
            rom: null
        };
        this.handleRomLoaded = this.handleRomLoaded.bind(this);
        this.tick = this.tick.bind(this);
    }

    handleRomLoaded(rom) {
        if (this.cpuInterval != null) {
            clearInterval(this.cpuInterval);
        }

        this.props.cpu.load(rom.data);
        this.setState({
            rom: rom,
            cpu: getCpuState(this.props.cpu)
        });
        setInterval(this.tick, 1000/500);
    }

    tick() {
        this.props.cpu.executeInstruction();
        this.setState({cpu: getCpuState(this.props.cpu)});
    }

    render() {
        return (
            <React.Fragment>
                <Header onRomLoaded={this.handleRomLoaded}/>
                <div className={styles.container}>
                    <Debugger
                        rom={this.state.rom}
                        cpu={this.state.cpu}/>
                    <Screen 
                        display={this.props.cpu.display} />
                </div>
            </React.Fragment>
        );
    }
}

export default App;
