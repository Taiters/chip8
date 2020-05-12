import { createUseStyles } from 'react-jss';


export default createUseStyles({
    container: {
        width: '100%',
        height: '100%',
    },
    status: {
        height: '1.75em',
        backgroundColor: '#3c3836',
        fontFamily: 'monospace',
        lineHeight: '1.75em',
        textAlign: 'right',
        color: '#EBDAB4',
        paddingRight: 8,
    },
    marker: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 55, 101, 0.5)',
        zIndex: 20,
    },
    breakpoint: {
        '&:before': {
            content: '""',
            width: 12,
            height: 12,
            backgroundColor: '#6682FF',
            display: 'block',
            borderRadius: 6,
            position: 'absolute',
            marginLeft: '-1rem',
            marginTop: 2,
        }
    }
});