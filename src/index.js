import React, {
    useState,
    useMemo,
    useEffect,
} from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import { createCpu } from 'chip8/app/cpu';
import { loadExample, ProjectStore } from 'chip8/app/projects';
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
import Modal from 'chip8/components/modal';
import NewProject from 'chip8/components/newProject';
import OpenProject from 'chip8/components/openProject';
import ErrorBoundary from 'chip8/components/error';


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
const projectStore = new ProjectStore(window.localStorage);

function App() {
    const [focus, setFocus] = useState(false);
    const [paused, setPaused] = useState(false);
    const [newProjectVisible, setNewProjectVisible] = useState(false);
    const [openProjectVisible, setOpenProjectVisible] = useState(false);

    const cpuState = useCpu(cpu, paused, !focus);
    const [project, setProject] = useProject(projectStore);
    const [rom, srcMap, errors] = useAssembler(cpu, project.code);

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

    useEffect(() => {
        const saveHandler = (e) => {
            if (e.key === 's' && e.metaKey) {
                e.preventDefault();

                saveProject();
            }
        };
        window.addEventListener('keydown', saveHandler);
        
        return () => window.removeEventListener('keydown', saveHandler);
    }, [project]);

    const createNewProject = (newProject) => {
        const id = projectStore.save(newProject);
        projectStore.setCurrent(id);

        setProject({...newProject, id});
    };

    const saveProject = () => {
        if (!project.user || project.id == null) {
            createNewProject(project);
        } else {
            projectStore.save(project);
        }
    };

    const exportROM = () => {
        window.showSaveFilePicker({
            suggestedName: `${project.title}.ch8`,
            types: [
                {
                    description: 'Chip-8 ROM file',
                    accept: { 'application/octet-stream': ['.ch8'] },
                },
            ]
        })
            .then(handle => handle.createWritable())
            .then(writeable => {
                writeable.write(rom);
                return writeable;
            })
            .then(writeable => writeable.close());
    };

    return (
        <ErrorBoundary>
            <Container direction={Container.Direction.VERTICAL}>
                <Container.Child>
                    <Header
                        project={project}
                        onNew={() => setNewProjectVisible(true)}
                        onOpen={() => setOpenProjectVisible(true)}
                        onSave={saveProject} 
                        onExportROM={exportROM} />

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
            <Modal title='New project' visible={newProjectVisible} onClose={() => setNewProjectVisible(false)}>
                <NewProject onProject={(project) => {
                    setNewProjectVisible(false);
                    createNewProject(project);
                }} />
            </Modal>
            <Modal title='Open project' visible={openProjectVisible} onClose={() => setOpenProjectVisible(false)}>
                <OpenProject
                    projectStore={projectStore}
                    onOpenProject={project => {
                        setOpenProjectVisible(false);
                        setProject(project);
                    }} 
                    onOpenExample={example => {
                        setOpenProjectVisible(false);
                        loadExample(example).then(setProject);
                    }}/>
            </Modal>
        </ErrorBoundary>
    );
}


ReactDOM.render(
    <App />,
    document.getElementById('app'));
