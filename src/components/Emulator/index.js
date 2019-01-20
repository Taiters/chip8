import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Screen from 'chip8/components/Screen';


const styles = (theme) => ({
    container: {
        backgroundColor: theme.primary,
        width: 576,
        margin: 'auto',
        padding: 8,
    }
});

const Emulator = ({classes}) => (
    <div className={classes.container}>
        <Screen />
    </div>
);

Emulator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Emulator);