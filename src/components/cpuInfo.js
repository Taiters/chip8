import React from 'react'; // eslint-disable-line no-unused-vars
import {HorizontalGroup, VerticalGroup, Item} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars
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
            <Item key={i}>
                <ValueDisplay name={name} value={props.registers[i]} />
            </Item>
        );
    }
    return (
        <VerticalGroup>
            <HorizontalGroup>
                {registers.slice(0, 8)}
            </HorizontalGroup>
            <HorizontalGroup>
                {registers.slice(8, 16)}
            </HorizontalGroup>
        </VerticalGroup>
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
            <Item key={i}>
                <Key name={name} pressed={props.keys[i]} />
            </Item>
        );
    }
    return (
        <VerticalGroup>
            <HorizontalGroup>
                {keys}
            </HorizontalGroup>
        </VerticalGroup>
    );
};

const CpuInfo = (props) => {
    return (
        <VerticalGroup>
            <HorizontalGroup>
                <Item>
                    <ValueDisplay name='PC' value={props.cpu.pc}/>
                </Item>
                <Item>
                    <ValueDisplay name='I' value={props.cpu.i}/>
                </Item>
                <Item>
                    <ValueDisplay name='DT' value={props.cpu.delay}/>
                </Item>
                <Item>
                    <ValueDisplay name='ST' value={props.cpu.delay}/>
                </Item>
                <Item>
                    <ValueDisplay name='Instr' value={'0x'+props.cpu.opcode.toString()}/>
                </Item>
            </HorizontalGroup>
            <Item>
                <Registers registers={props.cpu.registers} />
            </Item>
            <Item>
                <Keyboard keys={props.keys} />
            </Item>
        </VerticalGroup>
    );
};

export {ValueDisplay, Registers, Keyboard, Key, CpuInfo};
