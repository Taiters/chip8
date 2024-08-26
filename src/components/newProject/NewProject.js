import React, {
    useState
} from 'react';

import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    label: {
        display: 'block',
        color: '#aaa39e',
        marginBottom: 2,
    },
    input: {
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
        padding: [[8, 8]],
        backgroundColor: '#0d0c0f',
        border: 'none',
        color: '#fbf3e3',
        fontFamily: 'monospace',
        fontSize: '1em',
    },
    create: {
        border: 'none',
        display: 'block',
        textAlign: 'center',
        fontFamily: 'monospace',
        cursor: 'pointer',
        marginTop: 4,
        fontSize: '1em',
        color: '#fbf3e3',
        backgroundColor: '#5b5545',
        padding: [[4, 8]],
        marginLeft: 'auto',

        '&:hover': {
            color: '#26261F',
            backgroundColor: '#ebdab4',
        }
    }
});

export default function NewProject({onProject}) {
    const classes = useStyles();
    const [title, setTitle] = useState('');

    return (
        <div className={classes.container}>
            <form onSubmit={(e) => {
                e.preventDefault();

                onProject({
                    title: title || 'Untitled',
                    code: `; Project: ${title}\n\n`,
                });
            }}>
                <label htmlFor='name' className={classes.label}>Name</label>
                <input
                    type='text'
                    id='name' 
                    placeholder='Untitled'
                    className={classes.input} 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />

                <input type='submit' value='Create' className={classes.create} />
            </form>
        </div>
    );
}