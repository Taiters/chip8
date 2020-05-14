import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import { AsmException } from 'chip8/app/asm/exceptions';
import { parser, assembler } from 'chip8/app/asm';
import { cpu } from 'chip8/app/cpu';
import { Keymap } from './config';

import Container from 'chip8/components/container';
import Header from 'chip8/components/header';
import Editor from 'chip8/components/editor';
import Display from 'chip8/components/display';
import Debugger from 'chip8/components/debugger';
import example from 'chip8/example';


jss.setup(preset());
jss.createStyleSheet({
    '@global': {
        'window, html, body, .app': {
            margin: 0,
            padding: 0,
            height: '100%',
            backgroundColor: '#1D2021',
            color: '#fbf3e3',
            fontFamily: 'monospace',
        },
    },
}).attach();

const getCpuState = () => ({
    gfx: cpu.gfx.slice(),
    registers: Array.from(cpu.registers),
    memory: Array.from(cpu.memory),
    stack: Array.from(cpu.stack),
    pc: cpu.pc,
    sp: cpu.sp,
    dt: cpu.delayTimer,
    st: cpu.soundTimer,
    i: cpu.i,
});

function useCpu() {
    const [cpuState, setCpuState] = useState(getCpuState());
    const animationRequest = useRef();

    const update60hz = () => {
        cpu.updateTimers();

        setCpuState(getCpuState());
        animationRequest.current = requestAnimationFrame(update60hz);
    };

    useEffect(() => {
        animationRequest.current = requestAnimationFrame(update60hz);
        return () => cancelAnimationFrame(animationRequest.current);
    }, [animationRequest]);

    useEffect(() => {
        const interval = setInterval(() => {
            cpu.tick();
        }, 2);

        return () => clearInterval(interval);
    }, []);

    return cpuState;
}

function useAssembler(code) {
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setErrors([]);
        const timeout = setTimeout(() => {
            try {
                const program = parser.parse(code);
                const [rom, ] = assembler.assemble(program);
                cpu.load(rom);
            } catch(err) {
                if (err instanceof AsmException)
                    setErrors([err]);
                else
                    console.error(err); // eslint-disable-line no-console
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [code]);

    return errors;
}

function useInput(active) {
    useEffect(() => {
        if (!active)
            return;

        const onKeyDown = (e) => {
            const key = e.key.toUpperCase();
            if (key in Keymap)
                cpu.keyDown(Keymap[key]);
        };

        const onKeyUp = (e) => {
            const key = e.key.toUpperCase();
            if (key in Keymap)
                cpu.keyUp(Keymap[key]);
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            for (let i = 0; i < 16; i++) {
                cpu.keyUp(i);
            }

            if (active) {
                window.removeEventListener('keydown', onKeyDown);
                window.removeEventListener('keyup', onKeyUp);
            }
        };
    }, [active]);
}

function App() {
    const [code, setCode] = useState(example);
    const [focus, setFocus] = useState(false);
    const cpu = useCpu();
    const errors = useAssembler(code);

    useInput(!focus);

    return (
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child>
                <Header />
            </Container.Child>
            <Container>
                <Container.Child width="50%">
                    <Editor
                        focus={focus}
                        errors={errors} 
                        code={code}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        onChange={(code) => setCode(code)} />
                </Container.Child>
                <Container.Child width="50%">
                    <Container direction={Container.Direction.VERTICAL}>
                        <Container.Child height="50%">
                            <Display gfx={cpu.gfx} />
                        </Container.Child>
                        <Container.Child height="50%">
                            <Debugger {...cpu} />
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
