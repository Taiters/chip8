import React, {
    useState,
    useEffect,
    useMemo,
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
import Controls from 'chip8/components/controls';
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

function useCpu(paused) {
    const [cpuState, setCpuState] = useState(getCpuState());
    const animationRequest = useRef();

    const update60hz = () => {
        cpu.updateTimers();

        setCpuState(getCpuState());
        animationRequest.current = requestAnimationFrame(update60hz);
    };

    useEffect(() => {
        if (!paused) {
            animationRequest.current = requestAnimationFrame(update60hz);
            return () => cancelAnimationFrame(animationRequest.current);
        }
    }, [animationRequest, paused]);

    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => {
                cpu.tick();
            }, 2);

            return () => clearInterval(interval);
        }
    }, [paused]);

    return cpuState;
}

function useAssembler(code) {
    const [rom, setRom] = useState([]);
    const [srcMap, setSrcMap] = useState([]);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setErrors([]);
        const timeout = setTimeout(() => {
            try {
                const program = parser.parse(code);
                const [rom, srcMap] = assembler.assemble(program);
                setSrcMap(srcMap);
                setRom(rom);
            } catch(err) {
                if (err instanceof AsmException)
                    setErrors([err]);
                else
                    console.error(err); // eslint-disable-line no-console
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [code]);

    return [rom, srcMap, errors];
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
    const [paused, setPaused] = useState(false);
    const [rom, srcMap, errors] = useAssembler(code);
    const cpuState = useCpu(paused);

    useInput(!focus);
    useEffect(() => {
        cpu.load(rom), 
        setPaused(false);
    }, [rom]);

    const editor = useMemo(() => (
        <Editor
            focus={focus}
            errors={errors} 
            srcMap={srcMap}
            code={code}
            pc={paused ? cpuState.pc : null}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(code) => setCode(code)} />
    ), [focus, errors, srcMap, code, paused && cpuState.pc]);

    return (
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child>
                <Header />
            </Container.Child>
            <Container>
                <Container.Child width="50%">
                    {editor}
                </Container.Child>
                <Container.Child width="50%">
                    <Container direction={Container.Direction.VERTICAL}>
                        <Container.Child>
                            <Controls 
                                paused={paused}
                                onRestart={() => cpu.load(rom) }
                                onStep={() => cpu.tick() }
                                onTogglePause={() => setPaused(!paused) } />
                        </Container.Child>
                        <Container.Child height="calc(50% - 20px">
                            <Display gfx={cpuState.gfx} />
                        </Container.Child>
                        <Container.Child height="calc(50% - 20px)">
                            <Debugger {...cpuState} />
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
