import brace from 'brace'; // eslint-disable-line no-unused-vars
import 'brace/theme/gruvbox';

import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import useStyles from './style';


function Editor({onChange, code}) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <AceEditor 
                width='100%'
                height='100%'
                value={code}
                onChange={onChange}
                setOptions={{ printMargin: null }}
                theme='gruvbox' />
        </div>
    );
}

Editor.propTypes = {
    onChange: PropTypes.func.isRequired
};


export default Editor;