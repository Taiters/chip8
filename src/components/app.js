import React from 'react'; // eslint-disable-line no-unused-vars
import Screen from 'chip8/components/screen.js'; // eslint-disable-line no-unused-vars
import Controls from 'chip8/components/controls.js'; // eslint-disable-line no-unused-vars
import {CpuInfo} from 'chip8/components/cpuInfo.js'; // eslint-disable-line no-unused-vars
import {Row, Column} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars

function getCpuState(cpu) {
    return {
        opcode: cpu.getCurrentOpcode(),
        pc: cpu.pc,
        i: cpu.i,
        delay: cpu.delay,
        sound: cpu.sound,
        registers: cpu.registers,
    };
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cpu: getCpuState(this.props.cpu),
            keys: this.props.cpu.keyboard.keys,
            rom: null,
            running: false,
            romLoaded: false,
        };
        this.loadRom = this.loadRom.bind(this);
        this.run = this.run.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);
        this.tick = this.tick.bind(this);
        this.onKeyboardStateChange = this.onKeyboardStateChange.bind(this);

        this.props.cpu.keyboard.onKeyDown(this.onKeyboardStateChange);
        this.props.cpu.keyboard.onKeyUp(this.onKeyboardStateChange);
    }

    onKeyboardStateChange() {
        this.setState({keys: this.props.cpu.keyboard.keys});
    }

    loadRom(rom) {
        this.stopInterval();
        this.props.cpu.load(rom.data);
        this.setState({
            running: false,
            rom: rom,
            cpu: getCpuState(this.props.cpu),
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
            <Row>
                <Column width="33%">
                    <Controls
                        running={this.state.running}
                        romLoaded={this.state.romLoaded}
                        onRun={this.run}
                        onStep={this.tick}
                        onPause={this.pause}
                        onStop={this.stop}
                        onLoad={this.loadRom} />
                </Column>
                <Column width="67%">
                    <Screen display={this.props.cpu.display} />
                    <CpuInfo 
                        cpu={this.state.cpu} 
                        keys={this.state.keys} />
                </Column>
            </Row> 
        );
    }
}

export default App;
