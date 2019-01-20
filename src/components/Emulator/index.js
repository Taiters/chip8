import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Screen from 'chip8/components/Screen';
import Keyboard from 'chip8/components/Keyboard';


const styles = (theme) => ({
    container: {
        backgroundColor: theme.primary,
        width: 576,
        margin: {
            top: 32,
            left: 'auto',
            right: 'auto'
        },
        padding: 8,
        '@media (max-width: 576px)': {
            width: '100%',
            padding: 0,
            margin: {
                top: 0
            }
        }
    }
});

const Emulator = ({classes}) => (
    <div className={classes.container}>
        <Screen />
        <Keyboard />
    </div>
);

Emulator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Emulator);