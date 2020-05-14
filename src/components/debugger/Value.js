import React from 'react';
import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    value: {
        paddingRight: 16,
    },
    hex: {
        color: '#acd994',
    },
    bin: {
        color: '#8cccbd',
    },
    prefix: {
        fontSize: '0.9em',
    },
});


// const bin = (value) => `${value.toString(2).padStart(8, '0')}`;

export default function Value({value, hex, bin, dec, className}) {
    const classes = useStyles();

    const hexComponent = hex ? (
        <span className={`${classes.value} ${classes.hex}`}>
            <span className={classes.prefix}>0x</span>
            {value.toString(16).padStart(hex, '0').toUpperCase()}
        </span>
    ) : null;

    const binComponent = bin ? (
        <span className={`${classes.value} ${classes.bin}`}>
            <span className={classes.prefix}>0b</span>
            {value.toString(2).padStart(8, '0')}
        </span>
    ) : null;

    const decComponent = dec ? (
        <span className={classes.value}>
            {value}
        </span>
    ) : null;

    return (
        <span className={className}>
            {hexComponent}
            {binComponent}
            {decComponent}
        </span>
    );
}