import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import { createUseStyles } from 'react-jss';
import { FixedSizeList } from 'react-window';
import { List, ListItem } from './List';
import {clamp} from 'chip8/utils.ts';
import Value from './Value';


const useStyles = createUseStyles({
    container: {
        height: '100%',
        display: 'flex',
    },
    memoryContainer: {
        height: '100%',
    },
    activeStackLine: {
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(255, 255, 255, 0.1)',
        }
    }
});

class MemoryLine extends React.PureComponent {
    render() {
        const memory = this.props.data.memory[this.props.index]
        const mutateCpu = this.props.data.mutateCpu;
        const style = {
            ...this.props.style,
            lineHeight: '20px',
        };

        const address = `0x${this.props.index.toString(16).padStart(3, '0').toUpperCase()}`;

        const handleEdit = (value) => {
            mutateCpu(cpu => cpu.memory[this.props.index] = clamp(value, 0, 0xFF));
        }

        return (
            <div style={style}>
                <ListItem name={address}>
                    <Value value={memory} hex={2} bin dec onEditValue={handleEdit}/>
                </ListItem>
            </div>
        );
    }
}

function useFillContainer() {
    const [height, setHeight] = useState(0);
    const containerRef = useRef();

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current != null) {
                const container = containerRef.current;
                const containerHeight = container.getBoundingClientRect().height;
                setHeight(containerHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => window.removeEventListener('resize', updateHeight);
    }, [containerRef]);

    return [containerRef, height];
}

function MemoryList({memory, mutateCpu}) {
    const list = useRef();
    const classes = useStyles();
    const [containerRef, containerHeight] = useFillContainer();

    const listProps = {
        itemCount: memory.length,
        height: containerHeight,
        itemSize: 20,
        width: '100%',
        itemData: {
            memory,
            mutateCpu,
        }
    };

    useEffect(() => {
        if (list.current != null) {
            list.current.scrollToItem(0x200);
        }
    }, []);

    return (
        <div ref={containerRef} className={classes.memoryContainer}>
            <FixedSizeList ref={list} {...listProps}>
                {MemoryLine}
            </FixedSizeList>
        </div>
    );
}

const MemoizedMemoryList = React.memo(MemoryList, (a, b) => {
    if (a.mutateCpu != b.mutateCpu) {
        return true;
    }
    for (let i = 0; i < a.memory.length; i++) {
        if (a.memory[i] !== b.memory[i])
            return false;
    }

    return true;
});

export default function Memory ({memory, stack, sp, mutateCpu}) {
    const classes = useStyles();

    const stackLines = stack.map((v, i) => {
        const name = i.toString().padStart(2, '0');
        const lineClass = `${classes.stackLine} ${sp - 1 === i ? classes.activeStackLine : ''}`;

        const handleEdit = (newValue) => {
            mutateCpu(cpu => {
                cpu.stack[i] = clamp(newValue, 0, 0xFFF);
            });
        }

        return (
            <ListItem key={i} name={name} className={lineClass}>
                <Value value={v} hex={3} dec onEditValue={handleEdit}/>
            </ListItem>
        );
    });

    return (
        <div className={classes.container}>
            <List title="Stack">
                {stackLines}
            </List>
            <List title="Memory">
                <MemoizedMemoryList memory={memory} mutateCpu={mutateCpu} />
            </List>
        </div>
    );
}
