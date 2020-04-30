import React from 'react';
import ReactJson from 'react-json-view';


// Temp debugger
function Debugger ({data}) {
    return (
        <React.Fragment>
            <pre style={{color: 'white'}}>Temp AST viewer</pre>
            <ReactJson 
                theme='monokai'
                src={data} />
        </React.Fragment>
    );
}


export default Debugger;