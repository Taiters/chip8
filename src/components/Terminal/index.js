import React from 'react';
import PropTypes from 'prop-types';


class Caret extends React.Component {
    constructor(props) {
        super(props);
        this.blinkInterval = null;
        this.state = {
            visble: true,
        };
    }

    reset() {
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;

        const _this = this;
        this.setState({visible: true});
        this.blinkInterval = window.setInterval(() => {
            _this.setState({
                visible: !_this.state.visible,
            });
        }, 1000);
    }

    getStyle() {
        return {
            display: this.state.visible ? '' : 'none',
        };
    }

    componentDidMount() {
        this.reset();
    }

    componentWillUnmount() {
        clearInterval(this.blinkInterval);
        this.blinkInterval = null;
    }

    render() {
        return (
            <span className="terminal-caret" style={this.getStyle()}>&nbsp;</span>
        );
    }
}


class Input extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = React.createRef();
        this.caret = React.createRef();
        this.state = {
            focused: false,
            value: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    submit() {
        const value = this.state.value;
        this.setState({
            value: '',
        });

        this.props.onInput(value);
    }

    focus() {
        this.inputField.current.focus();
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            value: e.target.value,
        });

        const caret = this.caret.current;
        if (caret)
            caret.reset();
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

    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.submit();
                break;
        }
    }

    renderCaret() {
        if (!this.state.focused)
            return null;

        return (
            <Caret ref={this.caret} />
        );
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    &gt; {this.state.value}{this.renderCaret()}
                </div>
                <input
                    type="text"
                    className="terminal-input-field"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                    ref={this.inputField}
                    autoFocus />
            </React.Fragment>
        );
    }
}

Input.propTypes = {
    onInput: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};


const ContentItem = (props) => <pre className="terminal-output">{props.value}</pre>;

ContentItem.propTypes = {
    value: PropTypes.string.isRequired,
};

const Content = (props) => props.content.map((item, index) => <ContentItem key={index} value={item} />);

Content.propTypes = {
    content: PropTypes.array.isRequired,
};


class Terminal extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.input = React.createRef();
        this.state = {
            focused: true,
            content: props.message ? [props.message] : [],
            acceptingInput: true,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    scrollToBottom() {
        const _this = this;
        setTimeout(() => {
            _this.container.current.scrollTop = _this.container.current.scrollHeight;
        }, 1);
    }

    isAtBottom() {
        return this.container.current.scrollTop === this.container.current.scrollHeight;
    }

    handleClick() {
        if (this.input.current !== null)
            this.input.current.focus();
    }

    output(value) {
        this.setState((state) => ({
            content: [...state.content, value]
        }));
    }

    done(err) { 
        if (err)
            this.output(`Error: ${err}`);
        else
            this.output('\n');
        
        this.setState({
            acceptingInput: true
        });
    }

    handleInput(value) {
        const trimmedInput = value.trim();
        this.setState({
            acceptingInput: false,
            content: [...this.state.content, `> ${trimmedInput}`]
        });

        if (trimmedInput === '') {
            this.setState({
                acceptingInput: true
            });

            return;
        }

        const splitInput = trimmedInput.trim().split(/\s+/);
        const command = splitInput[0];
        const args = splitInput.slice(1);
        this.props.onCommand(command, args, this.output.bind(this), this.done.bind(this));

        this.scrollToBottom();
    }

    handleInputChange() {
        if (!this.isAtBottom())
            this.scrollToBottom();
    }

    render() {
        return (
            <div className="terminal" onClick={this.handleClick} ref={this.container}>
                <Content content={this.state.content} />
                {this.state.acceptingInput && <Input ref={this.input} onInput={this.handleInput} onChange={this.handleInputChange} />}
            </div>
        );
    }
}

Terminal.propTypes = {
    onCommand: PropTypes.func.isRequired,
    message: PropTypes.string,
};

export default Terminal;