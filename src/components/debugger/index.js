import React, {
    useMemo,
    useState,
} from 'react';
import ReactJson from 'react-json-view';

function DebuggerButton({hidden, onClick}) {
    const text = hidden ? 'Show' : 'Hide';
    return <button onClick={onClick}>{text}</button>;
}

// Temp debugger
function Debugger ({data, time}) {
    const [hidden, setHidden] = useState(true);
    const reactJson = useMemo(() => {
        if (hidden)
            return null;

        return (
            <ReactJson 
                theme='mocha'
                style={{
                    width: '100%',
                    height: 300,
                    overflow: 'auto',
                }}
                src={data} />
        );
    }, [data, hidden]);

    return (
        <React.Fragment>
            <pre style={{color: 'white'}}>Parser debug view (Slow)</pre>
            <pre style={{color: 'white'}}>Last parse: {time}ms</pre>
            <DebuggerButton
                hidden={hidden}
                onClick={() => setHidden(!hidden)} />
            {reactJson}
        </React.Fragment>
    );
}


export default Debugger;