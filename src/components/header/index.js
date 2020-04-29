import React from 'react';

import useStyles from './style';
import logoImg from './chip8-logo.png';


function Header() {
    const classes = useStyles();

    return (
        <div className={classes.header}>
            <img src={logoImg} />
        </div>
    );
}


export default Header;