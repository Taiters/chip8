import React from 'react';
import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    overlay: {
        position: 'absolute',
        backgroundColor: 'rgb(0, 0, 0, 0.5)',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 10,
    },
    container: {
        margin: [[0, 'auto']],
        backgroundColor: '#1D2021',
        border: [[1, 'solid', '#3e3b35']],
        boxShadow: [[0, 4, 8, 0, 'rgb(0, 0, 0, 0.5)']],
        minWidth: 300,
    },
    content: {
        padding: 8,
    },
    header: {
        backgroundColor: '#3e3b35',
        color: '#bdb4a3',
        padding: 4,
    },
    close: {
        border: 'none',
        color: '#bdb4a3',
        padding: 0,
        display: 'inline-block',
        marginLeft: 'auto',
        textAlign: 'center',
        backgroundColor: '#3e3b35',
        fontFamily: 'monospace',
        cursor: 'pointer',
        fontSize: '1em',
        float: 'right',
        textDecoration: 'underline',

        '&:hover': {
            color: '#fbf3e3',
        }
    }
});

export default function Modal({title, visible, onClose, children}) {
    const classes = useStyles();

    if (!visible)
        return null;

    return (
        <div className={classes.overlay}>
            <div className={classes.container}>
                <div className={classes.header}>
                    <span className={classes.title}>{title}</span>
                    <button className={classes.close} onClick={onClose}>Close</button>
                </div>
                <div className={classes.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}
