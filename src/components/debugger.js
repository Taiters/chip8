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
                    <td>v{i.toString(16)}</td>
                    <td>
                        0x{value.toString(16)
                            .toUpperCase()
                            .padStart(2, '0')}
                    </td>
                </tr>
            );
        });

        return (
            <div className={styles.container}>
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
                        {registers}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Debugger;
