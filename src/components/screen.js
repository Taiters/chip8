import React from 'react'; // eslint-disable-line no-unused-vars
import Display from 'chip8/gfx/display.js';
//import styles from 'chip8/styles/screen.scss';

class Screen extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.display = new Display(this.canvas.current);
        this.display.clear(this.props.background);
    }

    updateDisplay(cells) {
        for (var i = 0; i < cells.length; i++) {
            if (cells[i] == 0)
                continue;

            const x = i % 64;
            const y = Math.floor(i / 32);

            this.display.renderCell(x, y, this.props.foreground);
        }
    }

    render() {
        return <canvas 
            ref={this.canvas} 
            width="800" 
            height="600">
        </canvas>;
    }
}

export default Screen;
