import React from 'react';
import PropTypes from 'prop-types';
import {createUseStyles} from 'react-jss';


const useStyles = createUseStyles({
    entry: {
        margin: 0,
        padding: 0,
    },
});

const ContentEntry = ({entry}) => {
    const classes = useStyles();
    return (
        <pre className={classes.entry}>
            {entry}
        </pre>
    );
};

ContentEntry.propTypes = {
    entry: PropTypes.string.isRequired,
};

const Content = ({content}) => {
    const classes = useStyles();
    return (
        <div className={classes.contentContainer}>
            { content.map((entry, index) => <ContentEntry key={index} entry={entry} />) }
        </div>
    );
};

Content.propTypes = {
    content: PropTypes.array.isRequired,
};

export default Content;