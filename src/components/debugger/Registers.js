import React from 'react';
import { createUseStyles } from 'react-jss';

import { List, ListItem } from './List';
import Value from './Value';


const useStyles = createUseStyles({
    container: {
        display: 'flex',
        height: '100%',
    },
});

export default function Registers ({registers, pc, sp, dt, st, i}) {
    const classes = useStyles();

    const registerList = registers.map((value, index) => {
        const name = `v${index.toString(16).toUpperCase()}`;
        return (
            <ListItem key={index} name={name}>
                <Value value={value} hex={2} dec />
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
                    <Value value={pc} hex={3} dec /> 
                </ListItem>
                <ListItem name="I">
                    <Value value={i} hex={3} dec /> 
                </ListItem>
                <ListItem></ListItem>
                <ListItem name="DT">
                    <Value value={dt} hex={2} dec /> 
                </ListItem>
                <ListItem name="ST">
                    <Value value={st} hex={2} dec />
                </ListItem>
                <ListItem></ListItem>
                <ListItem name="SP">
                    <Value value={sp} hex={1} dec />
                </ListItem>
            </List>
        </div>
    );
}
