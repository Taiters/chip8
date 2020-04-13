import React from 'react';
import PropTypes from 'prop-types';
import {createUseStyles} from 'react-jss';

import Content from './content.js';
import {InputController, Input} from './input.js';


const useStyles = createUseStyles({

});

const Terminal = React.forwardRef(({output, requestInput, onInput}, ref) => { // eslint-disable-line react/display-name
    const classes = useStyles();
    return (
        <div className={classes.terminalContainer}>
            <Content content={output} />
            { requestInput &&
                <InputController ref={ref} onInput={onInput}>
                    {inputState => <Input {...inputState} />}
                </InputController>
            }
        </div>
    );
});

Terminal.propTypes = {
    output: PropTypes.array.isRequired,
    requestInput: PropTypes.bool.isRequired,
    onInput: PropTypes.func.isRequired,
};

export default Terminal;