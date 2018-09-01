import React from 'react'; // eslint-disable-line no-unused-vars
import Screen from 'chip8/components/screen.js'; // eslint-disable-line no-unused-vars
import Controls from 'chip8/components/controls.js'; // eslint-disable-line no-unused-vars
import {CpuInfo} from 'chip8/components/cpuInfo.js'; // eslint-disable-line no-unused-vars
import {Row, Column} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars

const mapCpuState = (cpu) => ({
    opcode: cpu.getCurrentOpcode(),
    pc: cpu.state.pc,
    i: cpu.state.i,
    delay: cpu.state.delay,
    sound: cpu.state.sound,
    registers: cpu.state.registers,
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cpu: mapCpuState(this.props.cpu),
            rom: null,
            running: false,
            romLoaded: false,
        };
        this.loadRom = this.loadRom.bind(this);
        this.run = this.run.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);
        this.tick = this.tick.bind(this);
    }

    loadRom(rom) {
        this.stopInterval();
        this.props.cpu.load(rom.data);
        this.setState({
            running: false,
            rom: rom,
            cpu: mapCpuState(this.props.cpu),
            romLoaded: true,
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
            cpu: mapCpuState(this.props.cpu),
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
        this.setState({cpu: mapCpuState(this.props.cpu)});
    }

    render() {
        return (
            <Row height="100%">
                <Column width="33%" height="100%">
                    <Controls
                        running={this.state.running}
                        romLoaded={this.state.romLoaded}
                        onRun={this.run}
                        onStep={this.tick}
                        onPause={this.pause}
                        onStop={this.stop}
                        onLoad={this.loadRom} />
                </Column>
                <Column width="67%" height="100%">
                    <Screen display={this.props.cpu.display} />
                    <CpuInfo 
                        cpu={this.state.cpu} />
                </Column>
            </Row> 
        );
    }
}

export default App;
