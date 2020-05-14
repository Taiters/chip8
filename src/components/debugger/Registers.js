import React from 'react';
import { createUseStyles } from 'react-jss';

import { List, ListItem } from './List';


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
                {value}
            </ListItem>
        );
    });

    return (
        <div className={classes.container}>
            <List title="General Purpose">
                {registerList}
            </List>
            <List title="Special Use">
                <ListItem name="PC">{pc}</ListItem>
                <ListItem name="SP">{sp}</ListItem>
                <ListItem name="I">{i}</ListItem>
                <ListItem name="DT">{dt}</ListItem>
                <ListItem name="ST">{st}</ListItem>
            </List>
        </div>
    );
}
