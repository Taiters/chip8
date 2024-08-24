/* eslint-disable react/jsx-no-target-blank */

import React from 'react';

import { createUseStyles } from 'react-jss';


const useStyles = createUseStyles({
    help: {
        maxWidth: '700px',
        '& a': {
            color: '#acd994',
        }
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
    }
});

export default function Help() {
    const classes = useStyles();
    return (
        <div className={classes.help}>
            <h2>Welcome to this Web-Based CHIP-8 Emulator!</h2>
            <h3>Controls</h3>
            <p>CHIP-8 uses a 16-key hexadecimal keypad which is mapped to the keyboard as shown:</p>
            <div className={classes.controls}>
                <table>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>C</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>D</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                            <td>E</td>
                        </tr>
                        <tr>
                            <td>A</td>
                            <td>0</td>
                            <td>B</td>
                            <td>F</td>
                        </tr>
                    </tbody>
                </table>
                <span style={{padding: '0 1em'}}> &gt;&gt; </span>
                <table>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <td>Q</td>
                            <td>W</td>
                            <td>E</td>
                            <td>R</td>
                        </tr>
                        <tr>
                            <td>A</td>
                            <td>S</td>
                            <td>D</td>
                            <td>F</td>
                        </tr>
                        <tr>
                            <td>Z</td>
                            <td>X</td>
                            <td>C</td>
                            <td>V</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3>Create & Edit Programs</h3>
            <p>Use the built-in editor to write your own CHIP-8 programs in an assembly-like syntax. The editor supports real-time debugging, making it easier for you to develop and test your code.</p>
            <h3>Inspect Memory & Registers</h3>
            <p>While your program runs, you can inspect the memory and registers to see the inner workings of your code. This feature is invaluable for debugging and learning how CHIP-8 operates.</p>
            <h3>Pause & Step Through Code</h3>
            <p>Pause execution at any time to take a closer look at your program&#39;s state. Step through your code instruction by instruction to better understand its behavior and identify any issues.</p>
            <h3>Load External ROMs</h3>
            <p>Already have a CHIP-8 ROM? Load it directly into the emulator and start playing or modifying it right away.</p>
            <h3>Learn & Experiment</h3>
            <p>Whether you&#39;re a seasoned developer or new to CHIP-8, this emulator is a way to learn and experiment with low-level programming.</p>
            <p>For a detailed guide on the assembly-like syntax, available commands, and more advanced features, please visit the <a target="_blank" href="https://github.com/Taiters/chip8/blob/master/docs/docs.md" alt="Link to documentation">Documentation Page</a>.</p>
            <p>Feel free to explore, experiment, and create your own CHIP-8 masterpieces! Enjoy your coding journey!</p>
            <hr/>
            <p style={{textAlign: 'center'}}>© 2024 <a alt="Personal site" target="_blank" href="https://dotslashdan.com">Dan Tait</a> | <a target="_blank" alt="Github repository" href="https://github.com/Taiters/chip8">Github</a></p>
        </div>
    );
}
