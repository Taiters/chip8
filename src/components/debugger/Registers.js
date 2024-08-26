import React from 'react';
import { createUseStyles } from 'react-jss';

import {clamp} from 'chip8/utils.ts';
import { List, ListItem } from './List';
import Value from './Value';


const useStyles = createUseStyles({
    container: {
        display: 'flex',
        height: '100%',
    },
});

export default function Registers ({registers, pc, sp, dt, st, i, mutateCpu}) {
    const classes = useStyles();

    const registerList = registers.map((value, index) => {
        const name = `v${index.toString(16).toUpperCase()}`;

        const handleEdit = (newValue) => {
            mutateCpu(cpu => {
                cpu.registers[index] = clamp(newValue, 0, 0xFF);
            });
        }

        return (
            <ListItem key={index} name={name}>
                <Value value={value} hex={2} dec onEditValue={handleEdit} />
            </ListItem>
        );
    });

    return (
        <div className={classes.container}>
            <List title="General Purpose">
                {registerList}
            </List>
            <List title="Special Use">
                <ListItem name="PC">
                    <Value value={pc} hex={3} dec onEditValue={(value) => mutateCpu(cpu => cpu.pc = clamp(value, 0, 0xFFF))}/> 
                </ListItem>
                <ListItem name="I">
                    <Value value={i} hex={3} dec onEditValue={(value) => mutateCpu(cpu => cpu.i = clamp(value, 0, 0xFFF))}/> 
                </ListItem>
                <ListItem></ListItem>
                <ListItem name="DT">
                    <Value value={dt} hex={2} dec onEditValue={(value) => mutateCpu(cpu => cpu.delayTimer = clamp(value, 0, 0xFF))}/> 
                </ListItem>
                <ListItem name="ST">
                    <Value value={st} hex={2} dec onEditValue={(value) => mutateCpu(cpu => cpu.soundTimer = clamp(value, 0, 0xFF))}/>
                </ListItem>
                <ListItem></ListItem>
                <ListItem name="SP">
                    <Value value={sp} hex={1} dec onEditValue={(value) => mutateCpu(cpu => cpu.sp = clamp(value, 0, 0xF))}/>
                </ListItem>
            </List>
        </div>
    );
}
