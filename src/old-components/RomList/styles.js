export default (theme) => ({
    container: {
        height: '100%',
        backgroundColor: theme.palette.secondary.darker,
    },
    rom: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: '1px',
        padding: '4px',
        cursor: 'pointer',
    },
    romName: {
        color: 'rgba(0, 0, 0, 0.6)',
        marginLeft: '1px',
        fontWeight: 'bold',
    },
    romInfoTable: {
        verticalAlign: 'bottom',
        color: 'rgba(0, 0, 0, 0.5)',
        fontSize: '0.75em',
    },
    romInfoKey: {
        paddingRight: '8px',
    },
    romInfoValue: {
    }
});