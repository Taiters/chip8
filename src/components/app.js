import React from 'react'; // eslint-disable-line no-unused-vars
import Header from 'chip8/components/header.js'; // eslint-disable-line no-unused-vars
import Screen from 'chip8/components/screen.js'; // eslint-disable-line no-unused-vars

import Cpu from 'chip8/cpu/cpu.js';
import Display from 'chip8/gfx/display.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.display = new Display('#F0F', '#000');
        this.cpu = new Cpu(null, this.display);
        this.handleROMLoaded = this.handleROMLoaded.bind(this);
        this.runCpu = this.runCpu.bind(this);
    }

    handleROMLoaded(romData) {
        this.cpu.load(romData);
        this.setState({romData});
        window.requestAnimationFrame(this.runCpu);
    }

    runCpu() {
        this.cpu.executeInstruction();
        window.requestAnimationFrame(this.runCpu);
    }

    render() {
        return (
            <React.Fragment>
                <Header onROMLoaded={this.handleROMLoaded}/>
                <Screen 
                    display={this.display} />
            </React.Fragment>
        );
    }
}

export default App;
