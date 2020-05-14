import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';

import React, {
    useRef,
    useEffect,
} from 'react';
import { createUseStyles } from 'react-jss';
import AceEditor from 'react-ace';

import './mode';


const Range = brace.acequire('ace/range').Range;

const useStyles = createUseStyles({
    container: {
        width: '100%',
        height: '100%',
        borderRight: '3px solid #3C3836',
        boxSizing: 'border-box',
    },
    marker: {
        position: 'absolute',
        borderRadius: 0,
        backgroundColor: 'rgb(255, 0, 0, 0.5)',
    },
    currentLine: {
        position:'absolute',
        borderRadius: 0,
        backgroundColor: 'rgb(255, 255, 255, 0.125)',
    }
});

const errorToAnnotation = (error) => ({
    text: error.message,
    row: error.token.line,
    column: error.token.column,
    type: 'error',
});

const errorToRange = (error) => new Range(
    error.token.line,
    error.token.column,
    error.token.line, 
    error.token.column + error.token.raw.length
);

function useErrors(ace, errors, classes) {
    useEffect(() => {
        if (ace.current != null&& errors != null) {
            const session = ace.current.editor.getSession();
            const annotations = [];
            const markers = [];
            
            for (const error of errors) {
                annotations.push(errorToAnnotation(error));
                markers.push(session.addMarker(errorToRange(error), classes.marker, 'text', true));
            }

            session.setAnnotations(annotations);

            return () => {
                session.setAnnotations([]);
                for (const marker of markers) {
                    session.removeMarker(marker);
                }
            };
        }
    }, [ace, errors]);
}

const useSrcMap = (ace, srcMap, pc, classes) => {
    useEffect(() => {
        if (ace.current != null && srcMap != null && pc != null) {
            const session = ace.current.editor.getSession();
            const line = srcMap[pc - 0x200];

            const marker = session.addMarker(new Range(line, 0, line, 1), classes.currentLine, 'fullLine');
            ace.current.editor.scrollToLine(line, true);

            return () => session.removeMarker(marker);
        }
    }, [ace, srcMap, pc]);
};

export default function Editor({code, srcMap, pc, errors, onChange, onFocus, onBlur}) {
    const classes = useStyles();
    const ace = useRef();

    useErrors(ace, errors, classes);
    useSrcMap(ace, srcMap, pc, classes);

    return (
        <div className={classes.container}>
            <AceEditor 
                ref={ace}
                width='100%'
                height='100%'
                mode='chip8'
                value={code}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                setOptions={{ printMargin: null }}
                theme='gruvbox' />
        </div>
    );
}