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
    dropdownItemDisabled: {
        cursor: 'default',
        color: '#9b9891',
        '&:hover': {
            backgroundColor: '#1D2021',
        }
    }
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

export function DropdownItem({title, onClick=null, href=null, disabled=false}) {
    const classes = useStyles();
    const className = `${classes.dropdownItem} ${disabled ? classes.dropdownItemDisabled : ''}`;
    
    return onClick != null ? (
        <button disabled={disabled} className={className} onClick={onClick}>{title}</button>
    ) : (
        <a disabled={disabled} className={className} style={{width: 'auto'}} href={href} rel='noopener noreferrer' target='_blank'>
            {title}
            {' '}
            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" viewBox="0 0 24 24" fill="none">
                <path d="M20.2929 9.70708C20.5789 9.99307 21.009 10.0786 21.3827 9.92385C21.7564 9.76907 22 9.40443 22 8.99997V2.99997C22 2.44768 21.5523 1.99997 21 1.99997H15C14.5955 1.99997 14.2309 2.24361 14.0761 2.61729C13.9213 2.99096 14.0069 3.42108 14.2929 3.70708L16.2322 5.64641L9.58574 12.2929C9.19522 12.6834 9.19522 13.3166 9.58574 13.7071L10.2928 14.4142C10.6834 14.8048 11.3165 14.8048 11.7071 14.4142L18.3536 7.76774L20.2929 9.70708Z" fill="#fbf3e3"/>
                <path d="M4.5 8.00006C4.5 7.72392 4.72386 7.50006 5 7.50006H10.0625C10.6148 7.50006 11.0625 7.05234 11.0625 6.50006V5.50006C11.0625 4.94777 10.6148 4.50006 10.0625 4.50006H5C3.067 4.50006 1.5 6.06706 1.5 8.00006V19.0001C1.5 20.9331 3.067 22.5001 5 22.5001H16C17.933 22.5001 19.5 20.9331 19.5 19.0001V13.9376C19.5 13.3853 19.0523 12.9376 18.5 12.9376H17.5C16.9477 12.9376 16.5 13.3853 16.5 13.9376V19.0001C16.5 19.2762 16.2761 19.5001 16 19.5001H5C4.72386 19.5001 4.5 19.2762 4.5 19.0001V8.00006Z" fill="#fbf3e3"/>
            </svg>
        </a>
    );
}