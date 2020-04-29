import React from 'react';
import PropTypes from 'prop-types';


import {
    useContainerStyles,
    useContainerChildStyles,
} from './style';


function Container({children, direction}) {
    const classes = useContainerStyles({direction});

    return (
        <div className={classes.container}>
            {children}
        </div>
    );
}

Container.propTypes = {
    direction: PropTypes.string
};

Container.Direction = {
    HORIZONTAL: 'row',
    VERTICAL: 'column'
};

Container.Child = function Child({children, width, height}) {
    const classes = useContainerChildStyles();
    const style = {
        width,
        height,
        minWidth: width,
        minHeight: height,
    };

    return (
        <div className={classes.containerChild} style={style}>
            {children}
        </div>
    );
};

Container.Child.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
};


export default Container;