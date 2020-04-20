import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';


const styles = (theme) => ({
    container: {
        backgroundColor: theme.palette.secondary.darkest,
        color: 'white',
        padding: '8px',
        marginBottom: '8px',
        fontSize: '1.2em',

        '@media (max-width: 576px)': {
            margin: 0,
        },
    },
});

const getRomDisplayName = (roms, current) => {
    if (current != null)
        return roms[current].name;

    return 'Select a ROM';
};

const Selector = ({classes, roms, current}) => (
    <div className={classes.container}>
        { getRomDisplayName(roms, current) }
    </div>
);

Selector.propTypes = {
    classes: PropTypes.object.isRequired,
    roms: PropTypes.array.isRequired,
    current: PropTypes.number,
};

const mapStateToProps = (state) => ({
    roms: state.roms.list,
    current: state.roms.current,
});

export default connect(
    mapStateToProps
)(injectSheet(styles)(Selector));