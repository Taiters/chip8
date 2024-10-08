import jss from 'jss';
import preset from 'jss-preset-default';
import posthog from 'posthog-js';
import {
    useEffect,
    useMemo,
    useState,
} from 'react';
import { createRoot } from 'react-dom/client';

import { createCpu } from 'chip8/app/cpu';
import {
    useAssembler,
    useCpu,
    useProject,
} from 'chip8/app/hooks';
import { loadExample, ProjectStore } from 'chip8/app/projects';

import Container from 'chip8/components/container';
import Controls from 'chip8/components/controls';
import Debugger from 'chip8/components/debugger';
import Display from 'chip8/components/display';
import Editor from 'chip8/components/editor';
import ErrorBoundary from 'chip8/components/error';
import Header from 'chip8/components/header';
import Help from 'chip8/components/help';
import Modal from 'chip8/components/modal';
import NewProject from 'chip8/components/newProject';
import OpenExample from './components/openExample';


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
    const [openExampleVisible, setOpenExampleVisible] = useState(false);
    const [mobileWarningVisible, setMobileWarningVisible] = useState(window.innerWidth <= 500);
    const [helpVisible, setHelpVisible] = useState(false);

    const [cpuState, mutateCpu, tickCPU] = useCpu(cpu, paused, !focus);
    const [project, setProject, saveAsProject, saveProject, openProject, confirmSave, confirmSaveModal] = useProject(projectStore);
    const [rom, srcMap, errors] = useAssembler(cpu, project);

    const editor = useMemo(() => (
        <Editor
            focus={focus}
            errors={errors} 
            srcMap={srcMap}
            project={project}
            pc={paused ? cpuState.pc : null}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onChange={(code) => setProject(project => ({...project, code, unsavedChanges: true}))} />
    ), [focus, errors, srcMap, project?.code, paused && cpuState.pc]);

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
        setProject(newProject);
    };

    const exportROM = () => {
        window.showSaveFilePicker({
            suggestedName: `${project.title}.ch8`,
            types: [
                {
                    description: 'CHIP-8 ROM file',
                    accept: { 'application/octet-stream': ['.ch8'] },
                },
            ]
        })
            .then(handle => handle.createWritable())
            .then(writeable => {
                writeable.write(rom);
                return writeable;
            })
            .then(writeable => writeable.close())
            .catch(() => {});
    };

    const importROM = async () => {
        confirmSave(() => {
            window.showOpenFilePicker({
                types: [
                    {
                        description: 'CHIP-8 ROM file',
                        accept: { 'application/octet-stream': ['.ch8'] },
                    },
                ],
                multiple: false,
            })
                .then(([handle]) => handle.getFile())
                .then(file => {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        const rom = new Uint8Array(reader.result);
                        setProject({
                            title: file.name,
                            rom,
                        });
                    });
                    reader.readAsArrayBuffer(file);
                })
                .catch(() => {});
        });
    };

    return (
        <ErrorBoundary>
            <Container direction={Container.Direction.VERTICAL}>
                <Container.Child>
                    <Header
                        project={project}
                        onHelp={() => setHelpVisible(true)}
                        onOpenExample={() => confirmSave(() => setOpenExampleVisible(true))}
                        onNew={() => setNewProjectVisible(true)}
                        onOpen={openProject}
                        onSave={saveProject} 
                        onSaveAs={saveAsProject}
                        onExportROM={exportROM}
                        onImportROM={importROM} />

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
                                    onStep={() => tickCPU()}
                                    onTogglePause={() => setPaused(!paused) } />
                            </Container.Child>
                            <Container.Child height="calc(50% - 20px">
                                <Display gfx={cpuState.gfx} />
                            </Container.Child>
                            <Container.Child height="calc(50% - 20px)">
                                <Debugger {...cpuState} mutateCpu={mutateCpu} />
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
            <Modal title='Open Example' visible={openExampleVisible} onClose={() => setOpenExampleVisible(false)}>
                <OpenExample
                    onOpenExample={example => {
                        setOpenExampleVisible(false);
                        loadExample(example).then(setProject);
                    }}/>
            </Modal>
            <Modal title='Help' visible={helpVisible} onClose={() => setHelpVisible(false)}>
                <Help />
            </Modal>
            <Modal title='Small screen warning' visible={mobileWarningVisible} onClose={() => setMobileWarningVisible(false)}>
                <h2>Welcome to this Web-Based CHIP-8 Emulator!</h2>
                <p>It looks like you&#39;re on a mobile device / small screen.</p>
                <p>This works best on a desktop / larger screen. However you&#39;re welcome to carry on and give it a try!</p>
            </Modal>
            {confirmSaveModal}
        </ErrorBoundary>
    );
}

posthog.init('phc_qRd1bCn3tqaADN5Rf1ZydGv1XCUOK50I3xkO8P5huXt',
    {
        api_host: 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        persistence: 'localStorage',
    }
);

createRoot(document.getElementById('app')).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
