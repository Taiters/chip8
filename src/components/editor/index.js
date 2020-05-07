import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';

import React, {
    useRef,
    useEffect,
} from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import Container from 'chip8/components/container';

import useStyles from './style';

import './mode';


function errorAnnotation(error) {
    return {
        row: error.line - 1,
        column: error.column,
        text: error.message,
        type: 'error',
    };
}

const errorMessage = (error) =>
    `${error.message} (${error.line}:${error.column})`;

function EditorStatus ({error}) {
    const classes = useStyles();

    return (
        <div className={classes.status}>
            {error ? errorMessage(error) : null}
        </div>
    );
}

function Editor({onChange, code, error}) {
    const classes = useStyles();
    const ace = useRef();

    useEffect(() => {
        if (ace.current && error) {
            ace.current.editor.getSession().setAnnotations([errorAnnotation(error)]);
        }
    }, [error]);

    return (
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child grow>
                <div className={classes.container}>
                    <AceEditor 
                        ref={ace}
                        width='100%'
                        height='100%'
                        mode='chip8'
                        value={code}
                        onChange={onChange}
                        setOptions={{ printMargin: null }}
                        theme='gruvbox' />
                </div>
            </Container.Child>
            <Container.Child>
                <EditorStatus error={error} />
            </Container.Child>
        </Container>
    );
}

Editor.propTypes = {
    onChange: PropTypes.func.isRequired
};


export default Editor;