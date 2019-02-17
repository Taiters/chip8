export default (theme) => ({
    '@keyframes open': {
        from: {
            marginLeft: '-602px',
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
            marginLeft: '-602px',
        },
    },
    container: {
        backgroundColor: theme.palette.secondary.darker,
        position: 'relative',
        boxShadow: '0px 0px 15px 10px #00000050',
        width: '600px',
        marginRight: '58px',
        height: '100%',
        '@media (max-width: 576px)': {
            display: 'none'
        },
        borderRight: '2px solid ' + theme.palette.secondary.darkest,
        display: 'flex',
    },
    open: {
        marginLeft: '0px',
    },
    closed: {
        marginLeft: '-602px',
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