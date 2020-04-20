import React from 'react';
import useStyles from './style';

import Separator from './separator';
import Container from './container';


class HorizontalResizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            resizing: false,
            left: {
                order: 0
            },
            right: {
                order: 2
            },
        };

        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    recalculateSize(offset) {
        const leftWidth = offset - 2;
        const rightWidth = document.body.offsetWidth - leftWidth - 3;
        this.setState({
            left: {
                width: leftWidth,
                flexGrow: 0,
                order: 0,
            },
            right: {
                width: rightWidth,
                flexGrow: 0,
                order: 2,
            },
        });
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.setState({
            resizing: true,
            flexGrow: 0,
        });
    }

    handleMouseUp(e) {
        e.preventDefault();
        this.setState({
            resizing: false
        });
    }

    handleMouseMove(e) {
        if (!this.state.resizing)
            return;

        e.preventDefault();
        this.recalculateSize(Math.min(document.body.offsetWidth, e.pageX));
    }

    handleResize() {
        if (!this.state.left.width)
            return;

        const ratio = this.state.left.width / (this.state.left.width + this.state.right.width);
        this.recalculateSize(document.body.offsetWidth * ratio);
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        return (
            <Container>
                { this.props.children(this.state.left, this.state.right) }
                <Separator 
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp } />
            </Container>
        );
    }
}

const ResizerPanel = ({children, width, flexGrow, order}) => {
    const classes = useStyles();

    return (
        <div style={{width, flexGrow, order, minWidth: '5%'}} className={classes.panel}>
            { children }
        </div>
    );
};


export {
    Container,
    HorizontalResizer,
    ResizerPanel,
};