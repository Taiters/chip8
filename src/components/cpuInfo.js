import React from 'react'; // eslint-disable-line no-unused-vars
import {Row, Column} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/cpuInfo.scss';

const ValueDisplay = (props) => {
    return (
        <div className={styles.valueContainer}>
            <div className={styles.valueName}>
                {props.name}
            </div>
            <div className={styles.valueValue}>
                {props.value}
            </div>
        </div>
    );
};

const Registers = (props) => {
    const registers = [];
    for (let i = 0; i < 16; i++) {
        const name = 'V'+i.toString(16).toUpperCase();
        registers.push(
            <ValueDisplay key={i} name={name} value={props.registers[i]} />
        );
    }
    return (
        <Column>
            <Row>
                {registers.slice(0, 8)}
            </Row>
            <Row>
                {registers.slice(8, 16)}
            </Row>
        </Column>
    );
};

const CpuInfo = (props) => {
    const instr = '0x' + props.cpu.opcode.toString();

    return (
        <Column grow="1">
            <Row>
                <ValueDisplay name='PC' value={props.cpu.pc}/>
                <ValueDisplay name='I' value={props.cpu.i}/>
                <ValueDisplay name='DT' value={props.cpu.delay}/>
                <ValueDisplay name='ST' value={props.cpu.delay}/>
                <ValueDisplay name='Instr' value={instr}/>
            </Row>
            <Registers registers={props.cpu.registers} />
        </Column>
    );
};

export {ValueDisplay, Registers, CpuInfo};
