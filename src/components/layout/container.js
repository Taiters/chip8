import React from 'react';

import useStyles from './style';


const Container = ({children}) => {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            { children }
        </div>
    );
};


export default Container;