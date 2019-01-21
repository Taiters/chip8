import React from 'react';
import {ThemeProvider} from 'react-jss';
import Emulator from 'chip8/components/Emulator';
import theme from './theme.js';


const App = () => (
    <ThemeProvider theme={theme}>
        <Emulator />
    </ThemeProvider>
);

export default App;