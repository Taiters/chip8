import React from 'react';

import Separator from './separator';
import useStyles from './style';


class ResizeController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: props.initialWidth,
            resizing: false,
            flexGrow: null,
        };

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
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
        this.setState({
            width: e.pageX - 2,
        });
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    render() {
        return (
            <React.Fragment>
                { this.props.children(this.state.width, this.state.flexGrow) }
                <Separator 
                    onMouseDown={ this.handleMouseDown }
                    onMouseUp={ this.handleMouseUp } />
            </React.Fragment>
        );
    }
}

const Panel = ({children, width, resize}) => {
    const classes = useStyles();

    if (resize) {
        return (
            <ResizeController initialWidth={ width }>
                { (width, flexGrow) => 
                    <div style={{width, flexGrow}} className={classes.panel}>
                        { children }
                    </div>
                }
            </ResizeController>
        );
    }

    return (
        <div style={{width}} className={classes.panel}>
            { children }
        </div>
    );
};


export default Panel;