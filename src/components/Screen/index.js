import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

const styles = () => ({
    screen: {
        backgroundColor: 'black',
        textAlign: 'center',
        color: 'white',
        width: '100%',
        fontFamily: 'mono',
        position: 'relative',
        'padding-top': '50%'
    }
});

const Screen = ({classes}) => (
    <div className={classes.screen}>
    </div>
);

Screen.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Screen);