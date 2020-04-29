import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';

import React, {
    useState
} from 'react';
import AceEditor from 'react-ace';

import useStyles from './style';


function Editor() {
    const classes = useStyles();
    const [value, setValue] = useState('Playing about with UI\nBout it');

    return (
        <div className={classes.container}>
            <AceEditor 
                width='100%'
                height='100%'
                value={value}
                onChange={setValue}
                setOptions={{ printMargin: null }}
                theme='gruvbox' />
        </div>
    );
}


export default Editor;