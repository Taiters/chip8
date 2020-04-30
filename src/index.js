import React, {
    useState,
    useEffect
} from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import parse from 'chip8/app/asm/parser';

import Container from 'chip8/components/container';
import Header from 'chip8/components/header';
import Editor from 'chip8/components/editor';
import Display from 'chip8/components/display';


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

const DEFAULT_CODE = `// This gets parsed kind of
// No error reporting...
// Just not a whole lot going on really

call 0x123
ret
LD v8, vC

// Parser output prints to the console`;

const App = () => {
    const [offset, setOffset] = useState(0);
    const [coords, setCoords] = useState({x: 0, y: 0});
    const [gfx, setGfx] = useState(Array(64 * 32).fill(0));
    const [code, setCode] = useState(DEFAULT_CODE);

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
        try {
            console.log(code); // eslint-disable-line no-console
            console.log(parse(code)); // eslint-disable-line no-console
        } catch(err) {
            console.error(err); // eslint-disable-line no-console
        }
    }, [code]);

    return (
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child>
                <Header />
            </Container.Child>
            <Container>
                <Container.Child width="50%">
                    <Editor onChange={setCode} code={code} />
                </Container.Child>
                <Container.Child width="50%">
                    <Display gfx={gfx} />
                </Container.Child>
            </Container>
        </Container>
    );
};


ReactDOM.render(
    <App />,
    document.getElementById('app'));
