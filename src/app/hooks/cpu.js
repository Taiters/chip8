import {
    useEffect,
    useRef,
    useState,
} from 'react';

import { Keymap } from 'chip8/config';

const TIMER_HZ = 60;
const TICK_HZ = 500;

const TIMER_TIME = 1000 / TIMER_HZ;
const TICK_TIME = 1000 / TICK_HZ;
const MAX_FRAME_TIME = TIMER_TIME;

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
    let previousTimestamp = 0;
    let timerTimer = 0;
    let tickTimer = 0;

    const update60hz = (timestamp) => {
        const frameTime = Math.min(timestamp - previousTimestamp, MAX_FRAME_TIME);
        timerTimer += frameTime;
        tickTimer += frameTime;

        previousTimestamp = timestamp;

        if (timerTimer >= TIMER_TIME) {
            cpu.updateTimers();
            timerTimer %= TIMER_TIME;
        }

        // CHIP-8 CPU ticks at 500hz, so we can just tick enough times here to achive this
        // (This performs MUCH better than a separate interval)
        const ticks = Math.floor(tickTimer / TICK_TIME);
        if (!paused) {
            for (let i = 0; i < ticks; i++) {
                cpu.tick();
            }
        }
        tickTimer %= TICK_TIME;

        setState(getCpuState(cpu));
        animationRequest.current = requestAnimationFrame(update60hz);
    };

    useEffect(() => {
        animationRequest.current = requestAnimationFrame(update60hz);

        return () => cancelAnimationFrame(animationRequest.current);
    }, [animationRequest, paused]);
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
    useInput(cpu, acceptInput);

    return [cpuState, () => {
        cpu.tick();
        setCpuState(getCpuState(cpu));
    }];
}
