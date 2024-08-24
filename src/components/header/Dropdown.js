import React from 'react';

import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    menuItem: {
        border: 'none',
        padding: 'none',
        display: 'block',
        textAlign: 'center',
        backgroundColor: '#1D2021',
        color: '#fbf3e3',
        fontFamily: 'monospace',
        cursor: 'pointer',
        margin: [[8, 2]],
        fontSize: '1em',
        width: 100,

        '&:hover': {
            backgroundColor: '#353936',
        }
    },
    dropdown: {
        display: 'flex',
        position: 'relative',

        '& $menuItem:after': {
            content: '" ▼"',
            fontSize: '0.8em',
        }
    },
    dropdownMenu: {
        position: 'absolute',
        top: 'calc(100% - 8px)',
        backgroundColor: '#1D2021',
        zIndex: 10,
        border: [[1, 'solid', '#35312d']],
        boxShadow: [[2, 2, 10, 0, 'rgba(0, 0, 0, 0.5)']],
        display: 'none',
        minWidth: 180,
    },
    dropdownVisible: {
        '& $menuItem': {
            backgroundColor: '#353936',
        },

        '& $dropdownMenu': {
            display: 'block',
        }
    },
    dropdownItem: {
        border: 'none',
        display: 'block',
        color: '#fbf3e3',
        backgroundColor: '#1D2021',
        fontSize: '1.1em',
        fontFamily: 'monospace',
        cursor: 'pointer',
        margin: [[4, 0]],
        padding: [[4, 16]],
        textAlign: 'left',
        width: '100%',

        '&:hover': {
            backgroundColor: '#373737',
        }
    },
});


export const DropdownMenu = React.forwardRef(function DropdownMenu({title, visible, onToggle, children}, ref) {
    const classes = useStyles();
    const className = visible ? `${classes.dropdown} ${classes.dropdownVisible}` : classes.dropdown;

    return (
        <div ref={ref} className={className} >
            <button className={classes.menuItem} onClick={onToggle}>{title}</button>
            <div className={classes.dropdownMenu}>
                {children}
            </div>
        </div>
    );
});

export function DropdownItem({title, onClick}) {
    const classes = useStyles();
    
    return (
        <button className={classes.dropdownItem} onClick={onClick}>{title}</button>
    );
}