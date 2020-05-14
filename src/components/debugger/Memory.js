import React, {
    useState,
    useEffect,
    useRef,
} from 'react';
import { createUseStyles } from 'react-jss';
import { FixedSizeList } from 'react-window';


const useStyles = createUseStyles({
    container: {
        height: '100%',
        display: 'flex',
    },
    address: {
        padding: [[0, 8]],
        margin: 0,
        color: '#9b9891',
        display: 'inline-block',
    },
    value: {
        padding: [[0, 16]],
        fontSize: '1.2em',
    },
    prefix: {
        fontSize: '0.75em',
    },
    stackContainer: {
        width: '33%',
        height: 'calc(100% - 16px)',
        padding: 8,
    },
    stackLine: {
        height: '30px',
        lineHeight: '30px',
    },
    stackLines: {
        height: 'calc(100% - 18px)',
        overflowY: 'auto',
    },
    memoryContainer: {
        width: '67%',
        height: 'calc(100% - 8px)',
        paddingTop: 8,
    },
    sectionTitle: {
        margin: [[8, 0, 0, 8]],
        height: 14,
        color: '#9b9891',
    }
});

const hex = (value) => `${value.toString(16).padStart(2, '0').toUpperCase()}`;
const bin = (value) => `${value.toString(2).padStart(8, '0').toUpperCase()}`;
const dec = (value) => value;

function Address({address}) {
    const classes = useStyles();

    return <span className={classes.address}>0x{address.toString(16).padStart(3, '0').toUpperCase()}</span>;
}

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
            lineHeight: '30px',
        };

        return (
            <div style={style}>
                <Address address={this.props.index} />
                <Value value={hex(memory)} prefix='0x' />
                <Value value={bin(memory)} prefix='0b' />
                <Value value={dec(memory)} />
            </div>
        );
    }
}

function useContainerHeight() {
    const [height, setHeight] = useState(0);
    const containerRef = useRef();

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current != null) {
                const container = containerRef.current;
                const containerHeight = container.getBoundingClientRect().height;
                const titleHeight = container.firstChild.getBoundingClientRect().height + 16;
                setHeight(containerHeight - titleHeight);
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
    const [containerRef, containerHeight] = useContainerHeight();

    const listProps = {
        itemCount: memory.length,
        height: containerHeight,
        itemSize: 30,
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
            <p className={classes.sectionTitle}>Memory:</p>
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
        const pointer = sp-1 === i ? ' <' : null;
        return (
            <div key={i} className={classes.stackLine}>
                <span className={classes.address}>{i.toString().padStart(2, '0')}</span>
                <span className={classes.value}>
                    <span className={classes.prefix}>0x</span>{v.toString(16).padStart(4, '0').toUpperCase()}{pointer}
                </span>
            </div>
        );
    });

    return (
        <div className={classes.container}>
            <div className={classes.stackContainer}>
                <p className={classes.sectionTitle}>Stack:</p>
                <div className={classes.stackLines}>
                    {stackLines}
                </div>
            </div>
            <MemoizedMemoryList memory={memory} />
        </div>
    );
}
