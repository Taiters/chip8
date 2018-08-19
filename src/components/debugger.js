import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/debugger.scss';

class Debugger extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const rom = this.props.rom;
        const cpu = this.props.cpu;

        if (rom == null) {
            return (
                <div className={styles.container}>
                    <p>No ROM loaded</p>
                </div>
            );
        }

        const registers = [];
        cpu.registers.forEach((value, i) => {
            registers.push(
                <tr key={i}>
                    <td>v{i.toString(16).toUpperCase()}</td>
                    <td>{value}</td>
                </tr>
            );
        });

        const playButton = this.props.running
            ? <button 
                onClick={this.props.onPause} 
                className={styles.button}>
                <i className='fa fa-pause'></i>
            </button>
            : <button 
                onClick={this.props.onRun} 
                className={styles.button}>
                <i className='fa fa-play'></i>
            </button>;

        const stepButtonClass = styles.button + ' ' + 
            (this.props.running ? styles.disabled : '');

        const stopButtonClass = styles.button + ' ' + 
            (cpu.pc == 0x200 ? styles.disabled : '');

        return (
            <div className={styles.container}>
                <div className={styles.controls}>
                    {playButton}
                    <button 
                        onClick={this.props.onStep}
                        className={stepButtonClass}>
                        <i className='fa fa-step-forward'></i>
                    </button>
                    <button 
                        onClick={this.props.onStop}
                        className={stopButtonClass}>
                        <i className='fa fa-stop'></i>
                    </button>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>ROM:</td>
                            <td>{rom.name} ({rom.bytes} bytes)</td>
                        </tr>
                        <tr>
                            <td>PC:</td>
                            <td>{cpu.pc}</td>
                        </tr>
                        <tr>
                            <td>I:</td>
                            <td>{cpu.i}</td>
                        </tr>
                        <tr>
                            <td>DT:</td>
                            <td>{cpu.delay}</td>
                        </tr>
                        <tr>
                            <td>ST:</td>
                            <td>{cpu.sound}</td>
                        </tr>
                        {registers}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Debugger;
