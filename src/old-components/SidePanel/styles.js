import features from 'chip8/config/features.js';


const sidePanelWidth = features.showMenu ? 600 : 500;
const sidePanelPx = (additional = 0) => (sidePanelWidth + additional) + 'px';

export default (theme) => ({
    '@keyframes open': {
        from: {
            marginLeft: '-' + sidePanelPx(2),
        },
        to: {
            marginLeft: '0px',
        },
    },
    '@keyframes close': {
        from: {
            marginLeft: '0px',
        },
        to: {
            marginLeft: '-' + sidePanelPx(2),
        },
    },
    container: {
        backgroundColor: theme.palette.secondary.darker,
        position: 'relative',
        boxShadow: '0px 0px 15px 10px #00000050',
        width: sidePanelPx(),
        marginRight: '58px',
        height: '100%',
        '@media (max-width: 576px)': {
            display: 'none'
        },
        borderRight: '2px solid ' + theme.palette.secondary.darkest,
        display: 'flex',
        fontFamily: ['Roboto', 'sans-serif'],
    },
    open: {
        marginLeft: '0px',
    },
    closed: {
        marginLeft: '-' + sidePanelPx(2),
        marginRight: '0px',
        boxShadow: '0px 0px 15px 10px #00000000',
    },
    control: {
        position: 'absolute',
        top: '32px',
        right: '-32px',
        width: '30px',
        height: '50px',
        borderRadius: '0 8px 8px 0',
        backgroundColor: theme.palette.secondary.darker,
        cursor: 'pointer',
        border: '2px solid ' + theme.palette.secondary.darkest,
        borderLeft: 'none',
        boxShadow: '0px 0px 15px 10px #00000050',
        textAlign: 'center',
        color: theme.palette.secondary.darkest,
        '&:before': {
            content: '""',
            position: 'absolute',
            left: '-30px',
            top: '-30px',
            height: '110px',
            width: '30px',
            backgroundColor: theme.palette.secondary.darker,
            cursor: 'default',
        }
    },
    content: {
        flexGrow: 1,
        height: '100%',
        position: 'relative',
    }
});