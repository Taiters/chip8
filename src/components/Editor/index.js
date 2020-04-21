import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';

import React, {
    useState
} from 'react';
import AceEditor from 'react-ace';


const Editor = () => {
    const [value, setValue] = useState('Playing about with UI\nBout it');

    return (
        <AceEditor 
            width='100%'
            height='100%'
            value={value}
            onChange={setValue}
            setOptions={{ printMargin: null }}
            theme='gruvbox' />
    );
};


export default Editor;