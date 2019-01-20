import React from 'react'; // eslint-disable-line no-unused-vars
import Paper from '@material-ui/core/Paper'; // eslint-disable-line no-unused-vars
import Grid from '@material-ui/core/Grid'; // eslint-disable-line no-unused-vars
import Typography from '@material-ui/core/Typography'; // eslint-disable-line no-unused-vars
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
    key: {
        textAlign: 'center',
        height: 32,
        lineHeight: '32px',
        cursor: 'pointer'
    },
    root: {
        padding: theme.spacing.unit
    }
});

const keyOrder = [
    0x1,
    0x2,
    0x3,
    0xC,
    0x4,
    0x5,
    0x6,
    0xD,
    0x7,
    0x8,
    0x9,
    0xE,
    0xA,
    0x0,
    0xB,
    0xF
];

const Key = ({className, onPress, onRelease, value, pressed}) => { // eslint-disable-line no-unused-vars
    const elevation = pressed ? 1 : 4;
    return (
        <Paper 
            className={className} 
            onMouseDown={() => onPress()}
            onMouseUp={() => onRelease()}
            onMouseLeave={() => onRelease()}
            square={true}
            elevation={elevation}>
            <Typography variant="button">
                {value.toString(16)}
            </Typography>
        </Paper>
    );
};

const Keyboard = ({classes, keys, onKeyPress, onKeyRelease}) => {
    const keyElements = keyOrder.map((value, i) => (
        <Grid item xs={3} key={i}>
            <Key 
                className={classes.key} 
                value={value}
                onPress={() => onKeyPress(value-1)}
                onRelease={() => onKeyRelease(value-1)} 
                pressed={keys[value-1] == 1} />
        </Grid>
    ));

    return (
        <Paper className={classes.root} square={true}>
            <Grid container spacing={8}>
                {keyElements}
            </Grid>
        </Paper>
    );
};

export default withStyles(styles)(Keyboard);