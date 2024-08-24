import {
    useState,
    useEffect,
} from 'react';

import { parser, assembler } from 'chip8/app/asm';
import { AsmException } from 'chip8/app/asm/exceptions';


export default function useAssembler(cpu, project) {
    const [rom, setRom] = useState([]);
    const [srcMap, setSrcMap] = useState([]);
    const [errors, setErrors] = useState([]);

    const code = project.code;
    const projectRom = project.rom;

    useEffect(() => {
        setErrors([]);
        if (code == null)
            return;

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

    useEffect(() => {
        if (projectRom != null) {
            setRom(projectRom);
        }
    }, [projectRom]);

    useEffect(() => {
        try {
            cpu.load(rom);
        } catch {
            alert('Could not load this ROM');
        }
    }, [rom]);

    return [rom, srcMap, errors];
}