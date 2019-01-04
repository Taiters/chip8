import React from 'react'; // eslint-disable-line no-unused-vars
import CssBaseline from '@material-ui/core/CssBaseline'; // eslint-disable-line no-unused-vars
import SideMenu from 'chip8/components/SideMenu'; // eslint-disable-line no-unused-vars

import store from 'chip8/app';

window.store = store;


const App = () => (
    <React.Fragment>
        <CssBaseline />
        <SideMenu />
    </React.Fragment>
);

export default App;