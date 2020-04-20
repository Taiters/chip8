import React from 'react';
import PropTypes from 'prop-types';
import {createUseStyles} from 'react-jss';


const useStyles = createUseStyles({
    caret: {
        backgroundColor: 'lightgreen',
    },
    input: {
        margin: 0,
        padding: 0,
    }
});

const Caret = ({visible}) => {
    const classes = useStyles();
    const style = {
        display: visible ? '' : 'none',
    };

    return (
        <span className={classes.caret} style={style}>&nbsp;</span>
    );
};

Caret.propTypes = {
    visible: PropTypes.bool.isRequired,
};

const Input = ({value, focused}) => {
    const classes = useStyles();

    return (
        <pre className={classes.input}>
            &gt; {value}<Caret visible={focused} />
        </pre>
    );
};

Input.propTypes = {
    value: PropTypes.string.isRequired,
    focused: PropTypes.bool.isRequired,
};

class InputController extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = React.createRef();
        this.state = {
            value: '',
            focused: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    focus() {
        this.inputField.current.focus();
    }

    submit() {
        const value = this.state.value;
        this.setState({
            value: '',
        });
        this.props.onInput(value);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            value: e.target.value,
        });
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.submit();
                break;
        }
    }

    handleFocus() {
        this.setState({
            focused: true,
        });
    }

    handleBlur() {
        this.setState({
            focused: false,
        });
    }

    render() {
        const children = this.props.children(this.state);
        return (
            <React.Fragment>
                {children}
                <input 
                    autoFocus 
                    type="text" 
                    onChange={this.handleChange} 
                    onKeyDown={this.handleKeyDown}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    ref={this.inputField}
                    value={this.state.value}
                    style={{
                        opacity: 0,
                        position: 'absolute',
                        left: -100,
                    }}/>
            </React.Fragment>
        );
    }
}

InputController.propTypes = {
    children: PropTypes.func.isRequired,
    onInput: PropTypes.func.isRequired,
};

export {
    InputController,
    Input,
};