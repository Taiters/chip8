import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import { AsmException } from 'chip8/app/asm/exceptions';
import { parse, assemble } from 'chip8/app/asm';
import cpu from 'chip8/app/cpu';

import Container from 'chip8/components/container';
import Header from 'chip8/components/header';
import Editor from 'chip8/components/editor';
import Display from 'chip8/components/display';
import example from 'chip8/example';


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

function App() {
    const [code, setCode] = useState(example);
    const [error, setError] = useState(null);
    const [gfx, setGfx] = useState(new Array(64 * 32));
    const animationRequest = useRef();

    const render = () => {
        setGfx(cpu.gfx.slice());
        cpu.updateTimers();
        animationRequest.current = requestAnimationFrame(render);
    };

    useEffect(() => {
        animationRequest.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationRequest.current);
    }, [animationRequest]);

    useEffect(() => {
        const interval = setInterval(() => {
            cpu.tick();
        }, 2);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setError(null);
        const timeout = setTimeout(() => {
            try {
                const program = parse(code);
                const rom = assemble(program);

                cpu.load(rom);
            } catch(err) {
                if (err instanceof AsmException)
                    setError(err);
                else
                    console.error(err); // eslint-disable-line no-console
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [code]);

    return (
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child>
                <Header />
            </Container.Child>
            <Container>
                <Container.Child width="50%">
                    <Editor onChange={(code) => setCode(code)} error={error} code={code} />
                </Container.Child>
                <Container.Child width="50%">
                    <Container direction={Container.Direction.VERTICAL}>
                        <Container.Child>
                            <Display gfx={gfx} />
                        </Container.Child>
                    </Container>
                </Container.Child>
            </Container>
        </Container>
    );
}


ReactDOM.render(
    <App />,
    document.getElementById('app'));
