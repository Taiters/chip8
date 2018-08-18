import 'normalize.css';
import 'chip8/styles/main.scss';

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import App from 'chip8/components/app.js'; // eslint-disable-line no-unused-vars
import Cpu from 'chip8/cpu/cpu.js';
import Keyboard from 'chip8/cpu/keyboard.js';
import Display from 'chip8/gfx/display.js';

const display = new Display('#fffeb3', '#515038');
const keyboard = new Keyboard();
const cpu = new Cpu(keyboard, display);

keyboard.attachToTarget(document);

//timer(60, () => console.log('once a second')).start(); //eslint-disable-line no-console

ReactDOM.render(<App cpu={cpu}/>, document.getElementById('app'));
