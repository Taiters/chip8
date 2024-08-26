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
    currentProject: {
        lineHeight: '42px',
    },
    project: {
        color: '#9b9891',
    }
});

const useMenu = () => {
    const menuRef = useRef();
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        if (!menuVisible || menuRef.current == null)
            return;
        
        const handleClick = (e) => {
            if (!menuRef.current.contains(e.target))
                setMenuVisible(false);
        };

        window.addEventListener('click', handleClick);

        return () => window.removeEventListener('click', handleClick);
    }, [menuVisible, menuRef]);

    return [menuRef, menuVisible, setMenuVisible];
};

export default function Header({project, onOpenExample, onNew, onSave, onSaveAs, onOpen, onExportROM, onImportROM, onHelp}) {
    const classes = useStyles();
    const [fileRef, fileMenuVisible, setFileMenuVisible] = useMenu();
    const [romRef, romMenuVisible, setRomMenuVisible] = useMenu();

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
                    <DropdownItem title='Save' disabled={onSave == null} onClick={() => {
                        setFileMenuVisible(false);
                        onSave();
                    }} />
                    <DropdownItem title='Save As' disabled={onSaveAs == null} onClick={() => {
                        setFileMenuVisible(false);
                        onSaveAs();
                    }} />
                    <DropdownItem title='Open Example' onClick={() => {
                        setFileMenuVisible(false);
                        onOpenExample();
                    }} />
                </DropdownMenu>
                <DropdownMenu title='ROMs' ref={romRef} visible={romMenuVisible} onToggle={() => setRomMenuVisible(!romMenuVisible)}>
                    <DropdownItem title='Export ROM' disabled={project?.rom} onClick={() => {
                        setRomMenuVisible(false);
                        onExportROM();
                    }} />
                    <DropdownItem title='Import ROM' onClick={() => {
                        setRomMenuVisible(false);
                        onImportROM();
                    }} />
                    <DropdownItem title='Find ROMS' href='https://github.com/kripod/chip8-roms' />
                </DropdownMenu>
                <button className={classes.menuItem} onClick={onHelp}>Help</button>
            </div>
            <div className={classes.currentProject}>
                <span className={classes.project}>
                    {project?.code == null ? 'ROM' : 'Project'}
                    {project?.unsavedChanges && '*'}
                    :
                </span> {project?.title}
            </div>
        </div>
    );
}