import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import palette from 'chip8/config/palette.js';

const styles = (theme) => ({
    screen: {
        width: '100%',
        backgroundColor: theme.palette.third.base,
        border: '2px solid ' + theme.palette.secondary.darkest,
        boxSizing: 'border-box',
        marginBottom: '-4px',
        '@media (max-width: 576px)': {
            border: 'none',
        }
    }
});

class Screen extends React.Component {
    constructor(props) {
        super(props);
        this.classes = props.classes;
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.ctx = this.canvas.current.getContext('2d');
        this.renderScreen();
    }

    renderScreen() {
        const gfx = this.props.gfx;

        this.ctx.fillStyle = palette.secondary.lightest;
        this.ctx.fillRect(0, 0, 640, 320);
        this.ctx.fillStyle = palette.secondary.darkest;

        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 64; x++) {
                const pixel = gfx[x + (y*64)];
                if (pixel == 1) {
                    this.ctx.fillRect(x*10, y*10, 10, 10);
                }
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.gfx != this.props.gfx) {
            this.renderScreen();
        }
    }

    render() {
        return (
            <canvas 
                className={this.classes.screen}
                ref={this.canvas} 
                width="640" 
                height="320" >
            </canvas>
        );
    }
}

Screen.propTypes = {
    classes: PropTypes.object.isRequired,
    gfx: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    gfx: state.cpu.gfx
});

export default connect(
    mapStateToProps,
)(injectSheet(styles)(Screen));