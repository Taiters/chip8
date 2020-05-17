import React from 'react';

import { createUseStyles } from 'react-jss';

import { getExamples } from 'chip8/app/projects';


const useStyles = createUseStyles({
    container: {
        display: 'flex'

    },
    projectListContainer: {
        flex: '1 1 auto',

        '&:first-child': {
            marginRight: 8,
        }
    },
    projectListTitle: {
        color: '#aaa39e',
        marginBottom: 2,
        display: 'block',
    },
    projectList: {
        backgroundColor: '#0d0c0f',
        height: 'calc(100% - 1em - 2px)',
        maxHeight: 250,
        overflowY: 'auto',
    },
    listItem: {
        display: 'block',
        backgroundColor: '#0d0c0f',
        border: 'none',
        padding: 4,
        color: 'white',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',

        '&:hover': {
            backgroundColor: '#393939',
        }
    }
});

function ListItem({name, onClick}) {
    const classes = useStyles();
    return (
        <button className={classes.listItem} onClick={onClick}>{name}</button>
    );
}

export default function OpenProject({projectStore, onOpenProject, onOpenExample}) {
    const classes = useStyles();
    const projects = Object.entries(projectStore.all()).map(([id, project]) => <ListItem
        key={id}
        name={project.title}
        onClick={() => onOpenProject(project)} />);
    
    const examples = getExamples().map(example => <ListItem
        key={example}
        name={example}
        onClick={() => onOpenExample(example)} />);

    return (
        <div className={classes.container}>
            <div className={classes.projectListContainer}>
                <span className={classes.projectListTitle}>User</span>
                <div className={classes.projectList}>
                    {projects}
                </div>
            </div>
            <div className={classes.projectListContainer}>
                <span className={classes.projectListTitle}>Examples</span>
                <div className={classes.projectList}>
                    {examples}
                </div>
            </div>
        </div>
    );
}