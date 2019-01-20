import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Screen from 'chip8/components/Screen';
import Keyboard from 'chip8/components/Keyboard';


const styles = () => ({
    container: {
        backgroundColor: '#808796',
        border: '2px solid #303952',
        width: 576,
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
        <Screen />
        <Keyboard />
    </div>
);

Emulator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Emulator);