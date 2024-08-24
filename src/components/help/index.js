import React from 'react';

import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    help: {
        maxWidth: '700px',
    }
});

export default function Help() {
    const classes = useStyles();
    return (
        <div className={classes.help}>
            <h2>Welcome to this Web-Based CHIP-8 Emulator!</h2>
            <h3>Create & Edit Programs</h3>
            <p>Use the built-in editor to write your own CHIP-8 programs in an assembly-like syntax. The editor supports real-time debugging, making it easier for you to develop and test your code.</p>
            <h3>Inspect Memory & Registers</h3>
            <p>While your program runs, you can inspect the memory and registers to see the inner workings of your code. This feature is invaluable for debugging and learning how CHIP-8 operates.</p>
            <h3>Pause & Step Through Code</h3>
            <p>Pause execution at any time to take a closer look at your program&#39;s state. Step through your code instruction by instruction to better understand its behavior and identify any issues.</p>
            <h3>Load External ROMs</h3>
            <p>Already have a CHIP-8 ROM? Load it directly into the emulator and start playing or modifying it right away.</p>
            <h3>Learn & Experiment</h3>
            <p>Whether you&#39;re a seasoned developer or new to CHIP-8, this emulator is a great way to learn and experiment with low-level programming.</p>
            <p>For a detailed guide on the assembly-like syntax, available commands, and more advanced features, please visit the Documentation Page.</p>
            <p>Feel free to explore, experiment, and create your own CHIP-8 masterpieces! Enjoy your coding journey!</p>
        </div>
    );
}
