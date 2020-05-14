import React from 'react';
import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        height: '100%',
    },
    title: {
        flex: '0 0 auto',
        color: '#9b9891',
        padding: 8,
    },
    list: {
        overflowY: 'auto',
        flex: '1 1 auto',
    },
    item: {
        height: 20,
        lineHeight: '20px',
        padding: [[0, 16]],
        fontSize: '1.1em',
    },
    name: {
        display: 'inline-block',
        marginRight: 16,
        color: '#9b9891',
        width: 30,
        fontSize: '0.9em',
    }
});

export function List({title, children}) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.title}>{title}</div>
            <div className={classes.list}>
                {children}
            </div>
        </div>
    );
}

export function ListItem({name, children}) {
    const classes = useStyles();

    return (
        <div className={classes.item}>
            <span className={classes.name}>{name}</span>
            {children}
        </div>
    );
}