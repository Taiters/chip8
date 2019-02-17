import React from 'react';
import AceEditor from 'react-ace';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import brace from 'brace'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import 'brace/theme/monokai';

import parser from 'chip8/app/assembler/parser.js';
import assembler from 'chip8/app/assembler/assembler.js';
import { setFocus, setSrc } from 'chip8/app/actions/editor.js';
import { initialize, play } from 'chip8/app/actions/cpu.js';

import './editorMode.js';


const styles = () => ({
    container: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
    editor: {
        flexGrow: 1,
    }
});

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            src: '',
        };

        this.handleRun.bind(this);
    }

    handleRun() {
        const ast = parser.parse(this.props.src);
        const rom = assembler.assemble(ast);

        this.props.onRun(rom);
    }

    render() {
        return (
            <div className={this.props.classes.container}>
                <button onClick={() => this.handleRun()}>Run</button>
                <AceEditor 
                    theme='monokai'
                    mode='chip8'
                    width='auto'
                    height='auto'
                    fontSize='18px'
                    value={this.props.src}
                    className={ this.props.classes.editor }
                    setOptions={{ printMargin: null }}
                    onChange={(src) => this.props.onSrcChange(src)}
                    onFocus={() => this.props.onEditorFocus()}
                    onBlur={() => this.props.onEditorBlur()} />
            </div>
        );
    }
}

Editor.propTypes = {
    classes: PropTypes.object.isRequired,
    src: PropTypes.string.isRequired,
    onEditorFocus: PropTypes.func.isRequired,
    onEditorBlur: PropTypes.func.isRequired,
    onSrcChange: PropTypes.func.isRequired,
    onRun: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    src: state.editor.src,
});

const mapDispatchToProps = (dispatch) => ({
    onEditorFocus: () => dispatch(setFocus(true)),
    onEditorBlur: () => dispatch(setFocus(false)),
    onSrcChange: (src) => dispatch(setSrc(src)),
    onRun: (data) => {
        dispatch(initialize(data));
        dispatch(play());
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectSheet(styles)(Editor));