import React, {
    useMemo,
} from 'react';
import ReactJson from 'react-json-view';


// Temp debugger
function Debugger ({data}) {
    const reactJson = useMemo(() => (
        <ReactJson 
            theme='mocha'
            style={{
                width: '100%',
                height: 300,
                overflow: 'auto',
            }}
            src={data} />
    ), [data]);

    return (
        <React.Fragment>
            <pre style={{color: 'white'}}>AST viewer</pre>
            {reactJson}
        </React.Fragment>
    );
}


export default Debugger;