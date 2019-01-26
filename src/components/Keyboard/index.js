import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import _ from 'lodash';
import { pressKey, releaseKey } from 'chip8/app/actions/cpu.js';
import { keyMap } from 'chip8/app/input.js';

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
        position: 'relative',
        height: 40,
        color: 'white',
        backgroundColor: theme.palette.secondary.base,
        width: '25%',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '40px',
        fontSize: '1.5em',
        cursor: 'pointer',
        userSelect: 'none',
        border: '2px solid ' + theme.palette.secondary.darker,
        boxShadow: '0px 0px 2px 2px #00000030',
        '@media (max-width: 576px)': {
            borderWidth: '2px',
            margin: 0,
            boxShadow: 'none',
        }
    },
    keyPressed: {
        backgroundColor: theme.palette.secondary.lighter,
    },
    letter: {
        position: 'absolute',
        lineHeight: 1,
        fontSize: '0.75em',
        top: '0px',
        right: '2px',
        color: 'rgba(0, 0, 0, 0.2)',
        '@media (max-width: 576px)': {
            display: 'none'
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
        <span className={classes.letter}>{keyMap[value].toUpperCase()}</span>
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