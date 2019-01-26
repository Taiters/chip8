import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import { selectRom } from 'chip8/app/actions/roms.js';


const styles = (theme) => ({
    container: {
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'middle',
        width: '100%',
        cursor: 'pointer',
        marginBottom: '8px',

        '@media (max-width: 576px)': {
            margin: 0,
        },

        '& select': {
            cursor: 'pointer',
            backgroundColor: theme.palette.secondary.darkest,
            width: '100%',
            border: 0,
            color: '#fff',
            fontSize: 'inherit',
            padding: '.5em',
            paddingRight: '2.5em',
            margin: 0,
            textIndent: '0.01px',
            textOverflow: '',
            appearance: 'none',
            fontWeight: 'bold',

            '& option': {
                backgroundColor: 'green'
            }
        },

        '&:before': {
            content: '""',
            position: 'absolute',
            pointerEvents: 'none',
            width: '2em',
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, .2)',
        },

        '&:after': {
            content: '"\\25BC"',
            position: 'absolute',
            pointerEvents: 'none',
            fontSize: '.625em',
            height: '1em',
            lineHeight: 1,
            right: '1.2em',
            top: '50%',
            marginTop: '-.5em',
            color: 'white',
        }
    },
});

const renderRomOptions = (roms) => roms.map((rom, i) => (
    <option key={i} value={i}>{ rom.name }</option>
));

const renderDefaultOption = (current) => {
    if (current != null)
        return null;

    return (
        <option value=''>Select a ROM</option>
    );
};

class Selector extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        if (value == null)
            return;

        this.props.onSelect(parseInt(value));
    }

    render() {
        const current = this.props.current != null ? this.props.current : undefined;
        return (
            <span className={this.props.classes.container}>
                <select value={current} onChange={this.handleChange}>
                    { renderDefaultOption(this.props.current) }
                    { renderRomOptions(this.props.roms) }
                </select>
            </span>
        );
    }
}

Selector.propTypes = {
    classes: PropTypes.object.isRequired,
    roms: PropTypes.array.isRequired,
    current: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    roms: state.roms.list,
    current: state.roms.current,
});

const mapDispatchToProps = (dispatch) => ({
    onSelect: (index) => dispatch(selectRom(index))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectSheet(styles)(Selector));