import React, { useEffect, useRef, useState } from 'react';
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
    dec: {
        cursor: 'pointer',
    },
    edit: {
        display: 'inline',
        backgroundColor: '#5b5545',
        width: '70px',
        color: '#fbf3e3',
        border: 'none',
        outline: 'none',
    },
});


// const bin = (value) => `${value.toString(2).padStart(8, '0')}`;

export default function Value({value, hex, bin, dec, className}) {
    const classes = useStyles();
    const [editing, setEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);
    const inputRef = useRef();

    useEffect(() => {
        if (!editing) {
            setEditedValue(value);
        }
    }, [value, editing]);

    useEffect(() => {
        if (!editing || inputRef.current == null) {
            return;
        }

        const handleClick = (e) => {
            if (!inputRef.current.contains(e.target)) {
                setEditing(false);
            }
        }
        window.addEventListener('click', handleClick);
        inputRef.current.getElementsByTagName('input')[0].select();

        return () => window.removeEventListener('click', handleClick);
    }, [editing, inputRef]);

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
        <span ref={inputRef} className={`${classes.value} ${classes.dec}`} onClick={() => setEditing(true)}>
            {editing ? (
                <input className={classes.edit} type="text" value={editedValue} onChange={(e) => setEditedValue(e.target.value)} />
            ) : value}
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
