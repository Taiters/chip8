import React from 'react';

import useStyles from './style';


const Separator = ({onMouseDown, onMouseUp}) => {
    const classes = useStyles();

    return (
        <div className={classes.separator}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp} />
    );
};


export default Separator;