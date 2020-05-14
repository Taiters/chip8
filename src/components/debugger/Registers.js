import React from 'react';
import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    container: {
        padding: [[10, 8]],
        display: 'flex',
        height: 'calc(100% - 20px)',
        overflowY: 'auto',
    },
    registerList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        flex: '1 1 auto',
    },
    item: {
        marginBottom: 4,
    },
    registerName: {
        display: 'inline-block',
        padding: [[4, 8]],
        color: '#9b9891',
    },
    registerValue: {
        fontSize: '1.3em',
    }
});

export default function Registers ({registers, pc, sp, dt, st, i}) {
    const classes = useStyles();

    const registerList = registers.map((value, index) => {
        const name = `v${index.toString(16).toUpperCase()}`;
        return (
            <li key={index} className={classes.item}>
                <span className={classes.registerName}>{name}</span>
                <span className={classes.registerValue}>{value}</span>
            </li>
        );
    });

    return (
        <div className={classes.container}>
            <ul className={classes.registerList}>
                {registerList}
            </ul>
            <ul className={classes.registerList}>
                <li className={classes.item}>
                    <span className={classes.registerName}>PC</span>
                    <span className={classes.registerValue}>{pc}</span>
                </li>
                <li className={classes.item}>
                    <span className={classes.registerName}>SP</span>
                    <span className={classes.registerValue}>{sp}</span>
                </li>
                <li className={classes.item}>
                    <span className={classes.registerName}>I</span>
                    <span className={classes.registerValue}>{i}</span>
                </li>
                <li className={classes.item}>
                    <span className={classes.registerName}>DT</span>
                    <span className={classes.registerValue}>{dt}</span>
                </li>
                <li className={classes.item}>
                    <span className={classes.registerName}>ST</span>
                    <span className={classes.registerValue}>{st}</span>
                </li>
            </ul>
        </div>
    );
}
