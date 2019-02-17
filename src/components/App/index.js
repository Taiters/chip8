import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { ThemeProvider } from 'react-jss';
import { ToastContainer } from 'react-toastify';
import { GuardSpinner } from 'react-spinners-kit';
import { connect } from 'react-redux';
import 'react-toastify/dist/ReactToastify.min.css';

import Emulator from 'chip8/components/Emulator';
import features from 'chip8/config/features.js';

import theme from './theme.js';


const spinnerStyles = () => ({
    spinnerContainer: {
        position: 'absolute',
        left: '50%',
        top: '300px',
        '@media (max-width: 576px)': {
            top: '50%',
        }
    },
    spinner: {
        position: 'relative',
        left: '-20px',
        top: '-20px',
    }
});

const Spinner = injectSheet(spinnerStyles)(({ classes }) => (
    <div className={classes.spinnerContainer}>
        <div className={classes.spinner}>
            <GuardSpinner
                frontColor={theme.palette.secondary.base} />
        </div>
    </div>
));

Spinner.propTypes = {
    classes: PropTypes.object.isRequired
};

const mainStyles = () => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
    }
});

const renderEditor = () => {
    if (!features.showEditor)
        return null;

    const Editor = React.lazy(() => import('chip8/components/Editor'));
    return (
        <Suspense fallback={null}>
            <Editor /> 
        </Suspense>
    );
};

const MainView = injectSheet(mainStyles)(({classes}) => {
    return (
        <div className={classes.container}>
            { renderEditor() }
            <Emulator />
        </div>
    );
});

MainView.propTypes = {
    classes: PropTypes.object.isRequired
};

const App = ({ romsLoaded }) => {
    let view;

    if (romsLoaded) {
        view = <MainView />;
    } else {
        view = <Spinner />;
    }

    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                { view }
                <ToastContainer 
                    position='bottom-center'
                    hideProgressBar={true} />
            </React.Fragment>
        </ThemeProvider>
    );
};

App.propTypes = {
    romsLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    romsLoaded: state.roms.list.length > 0
});

export default connect(mapStateToProps)(App);