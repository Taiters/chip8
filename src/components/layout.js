import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/layout.scss';

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.containerStyle = null;
    }

    render() {
        return (
            <div className={this.containerStyle}>
                {this.props.children}
            </div>
        );
    }
}

class VerticalGroup extends Group {
    constructor(props) {
        super(props);
        this.containerStyle = styles.verticalContainer;
    }
}

class HorizontalGroup extends Group {
    constructor(props) {
        super(props);
        this.containerStyle = styles.horizontalContainer;
    }
}

const Item = (props) => {
    const grow = typeof(props.size) !== 'undefined' 
        ? props.size 
        : 1;
    const style = {flexGrow: grow};

    return (
        <div className={styles.item} style={style}>
            {props.children}
        </div>
    );
};

export {
    VerticalGroup,
    HorizontalGroup,
    Item,
};
