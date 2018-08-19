import React from 'react'; // eslint-disable-line no-unused-vars

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
            <canvas 
                ref={this.canvas} 
                width="960" 
                height="480"
                style={{width: '100%'}}>
            </canvas>
        );
    }
}

export default Screen;
