import React from 'react';

import { createUseStyles } from 'react-jss';

import errorImg from './error.png';


const useStyles = createUseStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100vh',
    },
    content: {
        margin: [[0, 'auto']],
        textAlign: 'center',

        '& h1': {
            fontFamily: 'monospace',
        }
    },
    image: {
        marginBottom: 16,
    }
});

function ErrorView({error}) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <img src={errorImg} className={classes.image} alt='Something went wrong' />
                <h1>Something went wrong</h1>
                <p>{error.message}</p>
            </div>
        </div>
    );
}


export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error: error
        };
    }

    componentDidCatch() {
        // Clear all animation frame requests
        let animationFrameId = requestAnimationFrame(() => {});
        while (animationFrameId--) {
            cancelAnimationFrame(animationFrameId);
        }
    }

    render() {
        if (this.state.hasError) {
            return <ErrorView error={this.state.error} />;
        }

        return this.props.children;
    }
}