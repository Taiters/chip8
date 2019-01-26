import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Selector from 'chip8/components/Selector';
import Screen from 'chip8/components/Screen';
import Keyboard from 'chip8/components/Keyboard';


const styles = (theme) => ({
    container: {
        backgroundColor: theme.palette.secondary.darker,
        border: '2px solid ' + theme.palette.secondary.darkest,
        boxShadow: '0px 0px 15px 10px #00000050',
        width: 384,
        margin: {
            top: 32,
            left: 'auto',
            right: 'auto'
        },
        padding: 8,
        '@media (max-width: 576px)': {
            border: 0,
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
        <Selector />
        <Screen />
        <Keyboard />
    </div>
);

Emulator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Emulator);