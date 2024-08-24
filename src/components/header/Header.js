import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import { createUseStyles } from 'react-jss';

import { DropdownMenu, DropdownItem } from './Dropdown';
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
    currentProject: {
        lineHeight: '42px',
    },
    project: {
        color: '#9b9891',
    }
});

export default function Header({project, onNew, onSave, onOpen, onExportROM}) {
    const classes = useStyles();
    const fileRef = useRef();
    const [fileMenuVisible, setFileMenuVisible] = useState(false);

    useEffect(() => {
        if (!fileMenuVisible || fileRef.current == null)
            return;
        
        const handleClick = (e) => {
            if (!fileRef.current.contains(e.target))
                setFileMenuVisible(false);
        };

        window.addEventListener('click', handleClick);

        return () => window.removeEventListener('click', handleClick);
    }, [fileMenuVisible, fileRef]);

    return (
        <div className={classes.header}>
            <div className={classes.logo}>
                <img src={logoImg} />
            </div>
            <div className={classes.menu}>
                <DropdownMenu title='File' ref={fileRef} visible={fileMenuVisible} onToggle={() => setFileMenuVisible(!fileMenuVisible)}>
                    <DropdownItem title='New' onClick={() => {
                        setFileMenuVisible(false);
                        onNew();
                    }} />
                    <DropdownItem title='Open' onClick={() => {
                        setFileMenuVisible(false);
                        onOpen();
                    }} />
                    <DropdownItem title='Save' onClick={() => {
                        setFileMenuVisible(false);
                        onSave();
                    }} />
                    <DropdownItem title='Export ROM' onClick={() => {
                        setFileMenuVisible(false);
                        onExportROM();
                    }} />
                </DropdownMenu>
            </div>
            <div className={classes.currentProject}>
                <span className={classes.project}>Project:</span> {project.title}
            </div>
        </div>
    );
}