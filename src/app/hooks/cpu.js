import {
    useRef,
    useState,
    useEffect,
} from 'react';

import { Keymap } from 'chip8/config';


const getCpuState = (cpu) => ({
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

function useUpdate60hz(cpu, paused, setState) {
    const animationRequest = useRef();

    const update60hz = () => {
        cpu.updateTimers();

        setState(getCpuState(cpu));
        animationRequest.current = requestAnimationFrame(update60hz);
    };

    useEffect(() => {
        if (!paused) {
            animationRequest.current = requestAnimationFrame(update60hz);
            return () => cancelAnimationFrame(animationRequest.current);
        }
    }, [animationRequest, paused]);
}

function useUpdate500hz(cpu, paused) {
    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => {
                cpu.tick();
            }, 2);

            return () => clearInterval(interval);
        }
    }, [paused]);
}

function useInput(cpu, active) {
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


export default function useCpu(cpu, paused, acceptInput) {
    const [cpuState, setCpuState] = useState(getCpuState(cpu));

    useUpdate60hz(cpu, paused, setCpuState);
    useUpdate500hz(cpu, paused);
    useInput(cpu, acceptInput);

    return cpuState;
}