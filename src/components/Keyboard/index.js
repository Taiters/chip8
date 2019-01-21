import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import _ from 'lodash';
import { pressKey, releaseKey } from 'chip8/app/actions/cpu.js';

const styles = (theme) => ({
    keyboard: {
        width: '100%',
    },
    keyRow: {
        margin: {
            left: -8,
            top: 8
        },
        display: 'flex',
        flexDirection: 'row',
        '@media (max-width: 576px)': {
            margin: {
                left: '-8px',
                top: '0px'
            }
        }
    },
    key: {
        margin: {
            left: 8,
        },
        height: 60,
        color: 'white',
        fontFamily: 'mono',
        backgroundColor: theme.palette.secondary.base,
        flexGrow: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '60px',
        fontSize: '1.5em',
        cursor: 'pointer',
        userSelect: 'none',
        borderLeft: '6px solid ' + theme.palette.secondary.lighter,
        borderTop: '6px solid ' + theme.palette.secondary.lighter,
        borderRight: '6px solid ' + theme.palette.secondary.darker,
        borderBottom: '6px solid ' + theme.palette.secondary.darker,
        boxShadow: '2px 2px 1px 1px' + theme.palette.primary.darker,
        '@media (max-width: 576px)': {
            borderWidth: '2px',
            margin: 0,
        }
    },
    keyPressed: {
        backgroundColor: theme.palette.secondary.darker,
        borderLeft: '6px solid ' + theme.palette.secondary.darkest,
        borderTop: '6px solid ' + theme.palette.secondary.darkest,
        borderRight: '6px solid ' + theme.palette.secondary.base,
        borderBottom: '6px solid ' + theme.palette.secondary.base,
        boxShadow: 'none',
        '@media (max-width: 576px)': {
            borderWidth: '2px'
        }
    }
});

const keyOrder = [
    1, 2, 3, 12,
    4, 5, 6, 13,
    7, 8, 9, 14,
    10, 0, 11, 15
];

const getKeyClass = (isDown, classes) => {
    if (isDown)
        return classes.key + ' ' + classes.keyPressed;
    
    return classes.key;
};

const Key = ({classes, value, isDown, onPress, onRelease}) => (
    <div className={getKeyClass(isDown, classes)}
        onMouseDown={() => onPress(value)}
        onTouchStart={() => onPress(value)}
        onMouseUp={() => onRelease(value)}
        onMouseLeave={() => onRelease(value)}
        onTouchEnd={() => onRelease(value)}>
        {value.toString(16).toUpperCase()} 
    </div>
);

const Keyboard = ({classes, keys, onKeyPress, onKeyRelease}) => {
    const keyElements = keyOrder.map((key) => (
        <Key 
            key={key} 
            classes={classes} 
            isDown={keys[key] == 1}
            onPress={onKeyPress}
            onRelease={onKeyRelease}
            value={key} />
    ));

    const keyRows = _.chain(keyElements)
        .chunk(4)
        .map((row, i) => (
            <div key={i} className={classes.keyRow}>
                {row}
            </div>
        ))
        .value();

    return (
        <div className={classes.keyboard}>
            {keyRows}
        </div>
    );
};

Key.propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    isDown: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
    onRelease: PropTypes.func.isRequired,
};

Keyboard.propTypes = {
    classes: PropTypes.object.isRequired,
    keys: PropTypes.array.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onKeyRelease: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    keys: state.cpu.keys
});

const mapDispatchToProps = (dispatch) => ({
    onKeyPress: (id) => dispatch(pressKey(id)),
    onKeyRelease: (id) => dispatch(releaseKey(id))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectSheet(styles)(Keyboard));