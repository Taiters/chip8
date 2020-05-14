import React from 'react';
import { createUseStyles } from 'react-jss';

import logoImg from './chip8-logo.png';


const useStyles = createUseStyles({
    header: {
        height: 42,
        borderBottom: '3px solid #3C3836',
        padding: [[8, 19]],
        display: 'flex',
        fontSize: '1.1em',
    },
    logo: {
        marginRight: 20,
    },
    menu: {
        display: 'flex',
        flex: '1 1 auto',
    },
    menuItem: {
        border: 'none',
        padding: 'none',
        display: 'block',
        textAlign: 'center',
        backgroundColor: '#1D2021',
        color: '#fbf3e3',
        fontFamily: 'monospace',
        cursor: 'pointer',
        margin: [[0, 2]],
        fontSize: '1em',
        width: 80,
    },
    currentProject: {
        lineHeight: '42px',
    },
    project: {
        color: '#9b9891',
    }
});

export default function Header({project}) {
    const classes = useStyles();

    return (
        <div className={classes.header}>
            <div className={classes.logo}>
                <img src={logoImg} />
            </div>
            <div className={classes.menu}>
                {/* <button className={classes.menuItem} onClick={onNew}>New</button>
                <button className={classes.menuItem} onClick={onOpen}>Open</button>
                <button className={classes.menuItem} onClick={onOpen}>Docs</button> */}
            </div>
            <div className={classes.currentProject}>
                <span className={classes.project}>Project:</span> {project}
            </div>
        </div>
    );
}