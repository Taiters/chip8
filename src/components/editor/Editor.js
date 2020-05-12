import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';
import './mode';

import React, {
    useRef,
    useEffect,
} from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';
import { createUseStyles } from 'react-jss';


const Range = brace.acequire('ace/range').Range;

const useStyles = createUseStyles({
    container: {
        width: '100%',
        height: '100%',
    },
    marker: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 55, 101, 0.3)',
    },
    breakpoint: {
        '&:before': {
            content: '""',
            width: 12,
            height: 12,
            backgroundColor: '#6682FF',
            display: 'block',
            borderRadius: 6,
            position: 'absolute',
            marginLeft: '-1rem',
            marginTop: 2,
        }
    }
});

const errorToAnnotation = (error) => ({
    type: 'error',
    text: error.message,
    row: error.token.line,
    column: error.token.column,
});

const errorToRange = (error) => new Range(
    error.token.line,
    error.token.column,
    error.token.line, 
    error.token.column + error.token.raw.length
);

function useErrors(ace, errors, classes) {
    useEffect(() => {
        if (ace.current && errors != null) {
            const session = ace.current.editor.getSession();

            const annotations = [];
            const markerIds = [];
            for (const error of errors) {

                markerIds.push(session.addMarker(errorToRange(error), classes.marker, 'text', true));
                annotations.push(errorToAnnotation(error));
            }

            session.setAnnotations(annotations);

            return () => {
                session.setAnnotations([]);
                for (const markerId of markerIds) {
                    session.removeMarker(markerId);
                }
            }
        }
    }, [errors, ace]);

    return ace;
}

function useBreakpoints(ace, breakpoints, classes) {
    useEffect(() => {
        if (ace.current && breakpoints != null) {
            const session = ace.current.editor.getSession();
            for (const breakpoint of breakpoints) {
                session.setBreakpoint(breakpoint, classes.breakpoint);
            }

            return () => session.clearBreakpoints();
        }
    }, [breakpoints, ace]);
}

function useGutterListener(ace, onGutterClick) {
    useEffect(() => {
        if (ace.current) {
            const handler = (e) => {
                const position = e.getDocumentPosition();
                onGutterClick(position.row);
            };
            ace.current.editor.on('gutterclick', handler);

            return () => ace.current.editor.off('gutterclick', handler);
        }
    }, [ace]);
}

export default function Editor({code, errors, breakpoints, onChange, onFocus, onBlur, onGutterClick}) {
    const classes = useStyles();
    const ace = useRef();

    useErrors(ace, errors, classes);
    useBreakpoints(ace, breakpoints, classes);
    useGutterListener(ace, onGutterClick);

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
