import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import Cpu from 'chip8/cpu/cpu.js';
import Display from 'chip8/gfx/display.js';

const display = new Display('#fffeb3', '#515038');
const cpu = new Cpu(display);

cpu.reset();

const urlParams = new URLSearchParams(window.location.search);
const useMaterial = (/^true$/i).test(urlParams.get('material'));

if (useMaterial) {
    import('chip8/components/App').then(({default: App}) => { // eslint-disable-line no-unused-vars
        ReactDOM.render(<App cpu={cpu}/>, document.getElementById('app'));
    });
} else {
    import('normalize.css');
    import('chip8/styles/main.scss');
    import('chip8/components/app.js').then(({default: App}) => { // eslint-disable-line no-unused-vars
        ReactDOM.render(<App cpu={cpu}/>, document.getElementById('app'));
    });
}
