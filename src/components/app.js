import React from 'react'; // eslint-disable-line no-unused-vars
import Header from 'chip8/components/header.js'; // eslint-disable-line no-unused-vars
import Screen from 'chip8/components/screen.js'; // eslint-disable-line no-unused-vars
import Debugger from 'chip8/components/debugger.js'; // eslint-disable-line no-unused-vars

import Cpu from 'chip8/cpu/cpu.js';
import Keyboard from 'chip8/cpu/keyboard.js';
import Display from 'chip8/gfx/display.js';
import styles from 'chip8/styles/app.scss';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.display = new Display('#fffeb3', '#515038');
        this.keyboard = new Keyboard();
        this.keyboard.attachToTarget(document);
        this.cpu = new Cpu(this.keyboard, this.display);
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
                <div className={styles.container}>
                    <Debugger cpu={this.cpu}/>
                    <Screen 
                        display={this.display} />
                </div>
            </React.Fragment>
        );
    }
}

export default App;
