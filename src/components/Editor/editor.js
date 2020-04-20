import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';

import React from 'react';
import AceEditor from 'react-ace';


const Editor = () => (
    <AceEditor 
        width='100%'
        height='100%'
        setOptions={{ printMargin: null }}
        theme='gruvbox' />
);


export default Editor;