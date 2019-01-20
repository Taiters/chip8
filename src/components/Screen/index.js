import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

const styles = () => ({
    screen: {
        backgroundColor: 'black',
        textAlign: 'center',
        color: 'white',
        width: 576,
        height: 288,
        fontFamily: 'mono',
    },
    title: {
        margin: 0,
        padding: {
            top: 80
        },
        fontSize: '70px',
    },
});

const Screen = ({classes}) => (
    <div className={classes.screen}>
        <p className={classes.title}>CHIP8</p>
        <p className={classes.sub}>Select a ROM to begin...</p>
    </div>
);

Screen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Screen);