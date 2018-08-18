import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/screen.scss';


class Screen extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.props.display.attachCanvas(this.canvas.current);
        this.props.display.clear();
    }

    render() {
        return (
            <div className={styles.container}>
                <canvas 
                    ref={this.canvas} 
                    width="960" 
                    height="480"
                    style={{width: '100%'}}>
                </canvas>
            </div>
        );
    }
}

export default Screen;
