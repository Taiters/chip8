import React, {
    useState,
    useEffect,
    useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import { createCpu } from 'chip8/app/cpu';
import {
    useCpu,
    useAssembler,
    useProject,
} from 'chip8/app/hooks';

import Container from 'chip8/components/container';
import Header from 'chip8/components/header';
import Editor from 'chip8/components/editor';
import Controls from 'chip8/components/controls';
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
            color: '#fbf3e3',
            fontFamily: 'monospace',
        },
    },
}).attach();

const cpu = createCpu();

function App() {
    const [focus, setFocus] = useState(false);
    const [paused, setPaused] = useState(false);

    const cpuState = useCpu(cpu, paused, !focus);
    const [project, setProject] = useProject('example_face');
    const [rom, srcMap, errors] = useAssembler(project.code);

    useEffect(() => cpu.load(rom), [rom]);

    const editor = useMemo(() => (
        <Editor
            focus={focus}
            errors={errors} 
            srcMap={srcMap}
            code={project.code}
            pc={paused ? cpuState.pc : null}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(code) => setProject(project => ({...project, code}))} />
    ), [focus, errors, srcMap, project.code, paused && cpuState.pc]);

    return (
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child>
                <Header 
                    project={project.title} />
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
