import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

import logoImg from './chip8-logo-new.png';

const HEIGHT = 60;
const LOGO_HEIGHT = 40;

const useStyles = createUseStyles({
    header: {
        height: HEIGHT - (HEIGHT - LOGO_HEIGHT),
        backgroundColor: (theme) => theme.colors.background,
        padding: (HEIGHT - LOGO_HEIGHT) / 2,
    }
});

export default function Header() {
    const theme = useTheme();
    const classes = useStyles(theme);

    return (
        <div className={classes.header}>
            <img src={logoImg} />
        </div>
    );
}