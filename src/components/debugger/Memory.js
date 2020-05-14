import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import { createUseStyles } from 'react-jss';
import { FixedSizeList } from 'react-window';
import { List, ListItem } from './List';


const useStyles = createUseStyles({
    container: {
        height: '100%',
        display: 'flex',
    },
    value: {
        padding: [[0, 16]],
    },
    prefix: {
        fontSize: '0.75em',
    },
    memoryContainer: {
        height: '100%',
    },
    stackLine: {
        color: '#9b9891'
    },
    activeStackLine: {
        color: '#fbf3e3',
    }
});

const hex = (value) => `${value.toString(16).padStart(2, '0').toUpperCase()}`;
const bin = (value) => `${value.toString(2).padStart(8, '0').toUpperCase()}`;
const dec = (value) => value;

function Value({value, prefix}) {
    const classes = useStyles();
    let prefixComponent = null;
    if (prefix != null) {
        prefixComponent = <span className={classes.prefix}>{prefix}</span>;
    }

    return <span className={classes.value}>{prefixComponent}{value}</span>;
}

class MemoryLine extends React.PureComponent {
    render() {
        const memory = this.props.data[this.props.index];
        const style = {
            ...this.props.style,
            lineHeight: '20px',
        };

        const address = `0x${this.props.index.toString(16).padStart(3, '0').toUpperCase()}`;

        return (
            <div style={style}>
                <ListItem name={address}>
                    <Value value={hex(memory)} prefix='0x' />
                    <Value value={bin(memory)} prefix='0b' />
                    <Value value={dec(memory)} />
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

function MemoryList({memory}) {
    const list = useRef();
    const classes = useStyles();
    const [containerRef, containerHeight] = useFillContainer();

    const listProps = {
        itemCount: memory.length,
        height: containerHeight,
        itemSize: 20,
        width: '100%',
        itemData: memory,
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
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }

    return true;
});

export default function Memory ({memory, stack, sp}) {
    const classes = useStyles();

    const stackLines = stack.map((v, i) => {
        const name = i.toString().padStart(2, '0');
        const lineClass = `${classes.stackLine} ${sp - 1 === i ? classes.activeStackLine : ''}`;

        return (
            <ListItem key={i} name={name}>
                <span className={lineClass}>
                    0x{v.toString(16).padStart(3, '0').toUpperCase()}
                </span>
            </ListItem>
        );
    });

    return (
        <div className={classes.container}>
            <List title="Stack">
                {stackLines}
            </List>
            <List title="Memory">
                <MemoizedMemoryList memory={memory} />
            </List>
        </div>
    );
}
