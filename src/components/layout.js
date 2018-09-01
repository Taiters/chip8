import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/layout.scss';

class Container extends React.Component {
    constructor(props) {
        super(props);
        this.containerStyle = null;
    }

    getStyles() {
        const styles = {};

        if (typeof(this.props.width) !== 'undefined') {
            styles.width = this.props.width;
        }

        if (typeof(this.props.height) !== 'undefined') {
            styles.height = this.props.height;
        }

        if (typeof(this.props.grow) !== 'undefined') {
            styles.flexGrow = this.props.grow;
        }

        return styles;
    }

    render() {
        return (
            <div 
                style={this.getStyles()}
                className={this.containerStyle} >
                {this.props.children}
            </div>
        );
    }
}

class Column extends Container {
    constructor(props) {
        super(props);
        this.containerStyle = styles.verticalContainer;
    }
}

class Row extends Container {
    constructor(props) {
        super(props);
        this.containerStyle = styles.horizontalContainer;
    }
}

export {Container, Column, Row};
