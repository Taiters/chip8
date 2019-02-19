import React from 'react';
import injectSheet from 'react-jss';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import { connect } from 'react-redux';
import 'simplebar/dist/simplebar.min.css';

import { selectRom } from 'chip8/app/actions/roms.js';

import styles from './styles.js';


const getAuthorDisplay = (rom) => rom.author == null ? <i>Anonymous</i> : rom.author;
const getCreatedDisplay = () =>  (new Date()).toLocaleDateString();

const renderRoms = (roms, onSelect, classes) => {
    return roms.map((rom, i) => (
        <div key={i} className={classes.rom} onClick={() => onSelect(i)}>
            <span className={classes.romName}>{ rom.name }</span>
            <table cellPadding="0" className={classes.romInfoTable}>
                <tbody>
                    <tr>
                        <td className={classes.romInfoKey}>Size</td>
                        <td className={classes.romInfoValue}>123 B</td>
                    </tr>
                    <tr>
                        <td className={classes.romInfoKey}>Author</td>
                        <td className={classes.romInfoValue}>{ getAuthorDisplay(rom) }</td>
                    </tr>
                    <tr>
                        <td className={classes.romInfoKey}>Created</td>
                        <td className={classes.romInfoValue}>{ getCreatedDisplay(rom) }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    ));
};

const RomList = ({classes, roms, onSelect}) => (
    <SimpleBar className={classes.container}>
        { renderRoms(roms, onSelect, classes) }
    </SimpleBar>
);

RomList.propTypes = {
    classes: PropTypes.object.isRequired,
    roms: PropTypes.array.isRequired,
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
    mapDispatchToProps
)(injectSheet(styles)(RomList));