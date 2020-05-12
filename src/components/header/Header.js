import React from 'react';

import useStyles from './style';
import logoImg from './chip8-logo.png';


export default function Header() {
    const classes = useStyles();

    return (
        <div className={classes.header}>
            <img src={logoImg} />
        </div>
    );
}