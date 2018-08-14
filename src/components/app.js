import React from 'react'; // eslint-disable-line no-unused-vars
import Header from 'chip8/components/header.js'; // eslint-disable-line no-unused-vars
import Screen from 'chip8/components/screen.js'; // eslint-disable-line no-unused-vars

import Cpu from 'chip8/cpu/cpu.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.cpu = new Cpu();
        this.screen = React.createRef();
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

    componentDidMount() {
        this.screen.current.updateDisplay([
            0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0
        ]);
    }

    render() {
        return (
            <React.Fragment>
                <Header onROMLoaded={this.handleROMLoaded}/>
                <Screen 
                    ref={this.screen}
                    background='#000'
                    foreground='#f0f'/>
            </React.Fragment>
        );
    }
}

export default App;
