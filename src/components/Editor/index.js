import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/monokai';
import { connect } from 'react-redux';

import features from 'chip8/config/features.js';
import { setFocus } from 'chip8/app/actions/editor.js';
import parser from 'chip8/app/assembler/parser.js';
import assembler from 'chip8/app/assembler/assembler.js';

import './editorMode.js';
import { initialize, play } from 'chip8/app/actions/cpu.js';


const styles = (theme) => ({
    '@keyframes open': {
        from: {
            marginLeft: '-602px',
        },
        to: {
            marginLeft: '0px',
        },
    },
    '@keyframes close': {
        from: {
            marginLeft: '0px',
        },
        to: {
            marginLeft: '-602px',
        },
    },
    container: {
        backgroundColor: theme.palette.secondary.darker,
        position: 'relative',
        boxShadow: '0px 0px 15px 10px #00000050',
        width: '600px',
        marginRight: '58px',
        height: '100%',
        '@media (max-width: 576px)': {
            display: 'none'
        },
        borderRight: '2px solid ' + theme.palette.secondary.darkest,
    },
    open: {
        marginLeft: '0px',
    },
    closed: {
        marginLeft: '-602px',
        marginRight: '0px',
        boxShadow: '0px 0px 15px 10px #00000000',
    },
    control: {
        position: 'absolute',
        top: '32px',
        right: '-52px',
        width: '50px',
        height: '50px',
        borderRadius: '0 8px 8px 0',
        backgroundColor: theme.palette.secondary.darker,
        cursor: 'pointer',
        border: '2px solid ' + theme.palette.secondary.darkest,
        borderLeft: 'none',
        boxShadow: '0px 0px 15px 10px #00000050',
        '&:before': {
            content: '""',
            position: 'absolute',
            left: '-30px',
            top: '-30px',
            height: '110px',
            width: '30px',
            backgroundColor: theme.palette.secondary.darker,
            cursor: 'default',
        }
    },
    inner: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        padding: '8px',
    },
    editor: {
        border: '2px solid ' + theme.palette.secondary.base,
        flexGrow: 1,
    }
});

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: features.editorOpenAtStart,
            toggled: false,
            src: '',
        };

        this.toggleOpen.bind(this);
        this.handleChange.bind(this);
        this.handleRun.bind(this);
    }

    toggleOpen() {
        const isOpen = this.state.open;
        this.setState({
            open: !isOpen,
            toggled: true,
        });
    }

    handleChange(src) {
        this.setState({src});
    }

    handleRun() {
        const ast = parser.parse(this.state.src);
        const rom = assembler.assemble(ast);

        debugger; // eslint-disable-line no-debugger
        this.props.onRun(rom);
    }

    render() {
        const containerStyle = {};
        let containerClass = this.props.classes.container;
        if (this.state.open) {
            containerClass += ' ' + this.props.classes.open;

            if (this.state.toggled) {
                containerStyle['animation'] = 'open 0.2s';
            }
        } else {
            containerClass += ' ' + this.props.classes.closed;

            if (this.state.toggled) {
                containerStyle['animation'] = 'close 0.2s';
            }
        }

        return (
            <div className={containerClass} style={containerStyle}>
                <div className={this.props.classes.control} onClick={() => this.toggleOpen()}/>
                <div className={this.props.classes.inner}>
                    <button onClick={() => this.handleRun()}>Run</button>
                    <AceEditor 
                        theme='monokai'
                        mode='chip8'
                        width='auto'
                        height='auto'
                        fontSize='18px'
                        value={this.state.src}
                        className={ this.props.classes.editor }
                        setOptions={{ printMargin: null }}
                        onChange={(src) => this.handleChange(src)}
                        onFocus={() => this.props.onEditorFocus()}
                        onBlur={() => this.props.onEditorBlur()} />
                </div>
            </div>
        );
    }
}

Editor.propTypes = {
    classes: PropTypes.object.isRequired,
    onEditorFocus: PropTypes.func.isRequired,
    onEditorBlur: PropTypes.func.isRequired,
    onRun: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
    onEditorFocus: () => dispatch(setFocus(true)),
    onEditorBlur: () => dispatch(setFocus(false)),
    onRun: (data) => {
        dispatch(initialize(data));
        dispatch(play());
    },
});

export default connect(
    null,
    mapDispatchToProps
)(injectSheet(styles)(Editor));