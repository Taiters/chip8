import { createUseStyles } from 'react-jss';


export default createUseStyles({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
    },
    separator: {
        width: '5px',
        flex: '0 0 auto',
        backgroundColor: '#3C3836',
        cursor: 'ew-resize',
        flexOrder: 1,
    },
    panel: {
        flex: '1 1 auto',
        boxSizing: 'border-box',
    },
});