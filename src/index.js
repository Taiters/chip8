import React, {
    useState,
    useEffect
} from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import { AsmException } from 'chip8/app/asm/exceptions';
import { parse, assemble } from 'chip8/app/asm';

import Container from 'chip8/components/container';
import Header from 'chip8/components/header';
import Editor from 'chip8/components/editor';
import Display from 'chip8/components/display';
import Debugger from 'chip8/components/debugger';


jss.setup(preset());
jss.createStyleSheet({
    '@global': {
        'window, html, body, .app': {
            margin: 0,
            padding: 0,
            height: '100%',
            backgroundColor: '#1D2021',
        },
    },
}).attach();

const DEFAULT_CODE = `// This get's parsed (See debug window on right)
// Nothing else happens yet though...
JP $main

// Indents don't matter. But we're not animals
:smile
    0b01000010
    0b00010000
    0b10000001
    0b01000010
    0b00111100


:updatePos
    LD v2, v0 // Store previous X
    LD v3, v1 // Store previous Y
    ADD v0, 1
    ADD v1, 1
    
    // If X is 55, reset to 0
    SNE v0, 55
    LD v0, 0
    
    // If Y is 23, reset to 0
    SNE v1, 23
    LD v1, 0
    RET


:draw
    DRW v2, v3, 5 // Remove the previous smile
    DRW v0, v1, 5
    RET


:mainLoop
    CALL $updatePos
    CALL $draw
    LD DT, v4
    JP $mainLoop


:main
    LD v0, 0 // Current X
    LD v1, 0 // Current Y
    LD v4, 10 // Delay between updates
    LD I, $smile
    
    DRW v0, v1, 5
    
    CALL $mainLoop`;

const App = () => {
    const [offset, setOffset] = useState(0);
    const [coords, setCoords] = useState({x: 0, y: 0});
    const [gfx, setGfx] = useState(Array(64 * 32).fill(0));
    const [code, setCode] = useState(DEFAULT_CODE);
    const [program, setProgram] = useState({});
    const [error, setError] = useState(null);
    const [time, setTime] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setOffset(offset + 0.05);
        }, 1);
    }, [offset]);

    useEffect(() => {
        setCoords({
            x: Math.floor(32 + Math.cos(offset) * 20),
            y: Math.floor(16 + Math.sin(offset) * 10),
        });
    }, [offset]);

    useEffect(() => {
        const newGfx = [];
        const index = coords.y * 64 + coords.x;

        for (let i = 0; i < 64 * 32; i++) {
            newGfx.push(i == index ? 1 : 0);
        }

        setGfx(newGfx);
    }, [coords]);

    useEffect(() => {
        let errorTimeout = null;
        setError(null);
        try {
            const start = (new Date()).getMilliseconds();
            const program = parse(code);
            assemble(program);
            const end = (new Date()).getMilliseconds();
            setProgram(program);
            setTime(end - start);
        } catch(err) {
            if (err instanceof AsmException)
                errorTimeout = setTimeout(() => setError(err), 1000);
            else
                console.error(err); //eslint-disable-line no-console
        }

        return () => clearTimeout(errorTimeout);
    }, [code]);

    return (
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child>
                <Header />
            </Container.Child>
            <Container>
                <Container.Child width="50%">
                    <Editor onChange={(code) => setCode(code)} error={error} code={code} time={time} />
                </Container.Child>
                <Container.Child width="50%">
                    <Container direction={Container.Direction.VERTICAL}>
                        <Container.Child>
                            <Display gfx={gfx} />
                        </Container.Child>
                        <Container.Child grow>
                            <Debugger data={program}/>
                        </Container.Child>
                    </Container>
                </Container.Child>
            </Container>
        </Container>
    );
};


ReactDOM.render(
    <App />,
    document.getElementById('app'));
