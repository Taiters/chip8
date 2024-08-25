import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';

import {
    useEffect,
    useRef,
} from 'react';
import AceEditor from 'react-ace';
import { createUseStyles } from 'react-jss';

import { disassemble } from 'chip8/app/asm/disassembler/index';
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
    },
    notAvailable: {
        textAlign: 'center',
        fontSize: '1.5em',
        color: '#9b9891',
        padding: '0.5em',
        fontFamily: 'monospace',

        '& button': {
            fontSize: '1em',
            cursor: 'pointer',
            background: 'none',
            color: '#acd994',
            border: 'none',
            fontFamily: 'monospace',

            '&:hover': {
                textDecoration: 'underline',
            }
        }
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

export default function Editor({project, srcMap, pc, errors, onChange, onFocus, onBlur}) {
    const classes = useStyles();
    const ace = useRef();

    useErrors(ace, errors, classes);
    useSrcMap(ace, srcMap, pc, classes);

    const onDisassemble = () => {
        const lines = disassemble(project.rom);
        onChange(lines.join('\n'));
    }

    return (
        <div className={classes.container}>
            {project.code != null ? (
                <AceEditor 
                    ref={ace}
                    width='100%'
                    height='100%'
                    mode='chip8'
                    value={project.code}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    setOptions={{ printMargin: null }}
                    theme='gruvbox' />
            ) : (
                    <div className={classes.notAvailable}>
                        <p>The disassembler for imported ROMs is currently experimental and may be buggy.</p>
                        <p>Once triggered, the program will attempt to run from the disassembled source, however broken..</p>
                        <button onClick={onDisassemble}>Disassemble</button>
                    </div>
            )}
        </div>
    );
}
