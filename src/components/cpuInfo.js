import React from 'react'; // eslint-disable-line no-unused-vars
import {Row, Column} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars
import {classNames} from 'chip8/utils/component.js';
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

const Key = (props) => {
    const keyClass = classNames({
        [styles.key]: true,
        [styles.keyPressed]: props.pressed,
    });
    return (
        <div className={keyClass}>
            {props.name}
        </div>
    );
};

const Keyboard = (props) => {
    const keys = [];
    for (let i = 0; i < 16; i++) {
        const name = i.toString(16).toUpperCase();
        keys.push(
            <Key key={i} name={name} pressed={props.keys[i]} />
        );
    }
    return (
        <Column>
            <Row>
                {keys}
            </Row>
        </Column>
    );
};

const CpuInfo = (props) => {
    return (
        <Column>
            <Row>
                <ValueDisplay name='PC' value={props.cpu.pc}/>
                <ValueDisplay name='I' value={props.cpu.i}/>
                <ValueDisplay name='DT' value={props.cpu.delay}/>
                <ValueDisplay name='ST' value={props.cpu.delay}/>
                <ValueDisplay name='Instr' value={'0x'+props.cpu.opcode.toString()}/>
            </Row>
            <Registers registers={props.cpu.registers} />
            <Keyboard keys={props.keys} />
        </Column>
    );
};

export {ValueDisplay, Registers, Keyboard, Key, CpuInfo};
