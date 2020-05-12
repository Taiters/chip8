import React from 'react';
import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    container: {
        width: '100%',
        height: '32px',
        backgroundColor: 'green',
    }
});

export default function EditorStatus({}) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
        </div>
    );
}