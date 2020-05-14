import React from 'react';
import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    container: {
        height: 40,
        display: 'flex',
    },
    button: {
        border: 'none',
        padding: 'none',
        display: 'block',
        height: '100%',
        textAlign: 'center',
        color: '#fbf3e3',
        backgroundColor: '#5b5545',
        fontSize: '1.1em',
        fontFamily: 'monospace',
        cursor: 'pointer',
        margin: [[0, 2]],
        width: 80,

        '&:hover': {
            color: '#26261F',
            backgroundColor: '#ebdab4',
        }
    },
    disabled: {
        cursor: 'default',
        backgroundColor: '#464544',
        color: '#a8a8a8',

        '&:hover': {
            backgroundColor: '#464544',
            color: '#a8a8a8',
        }
    }
});

export default function Controls({paused, onTogglePause, onRestart, onStep}) {
    const classes = useStyles();
    const skipButtonClasses = `${classes.button} ${paused ? '' : classes.disabled}`;

    return (
        <div className={classes.container}>
            <button className={classes.button} onClick={onTogglePause}>
                { paused ? 'Resume' : 'Pause' }
            </button>
            <button className={skipButtonClasses} onClick={() => paused ? onStep() : null}>
                Step
            </button>
            <button className={classes.button} onClick={onRestart}>
                Restart
            </button>
        </div>
    );
}