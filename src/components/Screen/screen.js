import React from 'react';


class Screen extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.ctx = this.canvas.current.getContext('2d');
        this.ctx.fillStyle = 'rgb(0, 255, 255)';
        this.ctx.fillRect(0, 0, 640, 320);
    }

    render() {
        return (
            <canvas 
                style={{
                    width: '100%'
                }}
                ref={this.canvas} 
                width="640" 
                height="320" >
            </canvas>
        );
    }
}


export default Screen;