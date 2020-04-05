import React from 'react';
import PropTypes from 'prop-types';


class Caret extends React.Component {
    constructor(props) {
        super(props);
        this.caret = React.createRef();
        this.interval = null;
    }

    componentDidMount() {
        const caret = this.caret.current;
        this.interval = setInterval(() => {
            const currentDisplay = caret.style.display;
            if (currentDisplay === 'none') {
                caret.style.display = '';
            } else {
                caret.style.display = 'none';
            }
        }, 1000);
    }

    componentWillUnmount() {
        if (this.interval === null)
            return;

        clearInterval(this.interval);
        this.interval = null;
    }

    render() {
        return (
            <span className="terminal-caret" ref={this.caret}>&nbsp;</span>
        );
    }
}


class Input extends React.Component {
    constructor(props) {
        super(props);
        this.inputField = React.createRef();
        this.state = {
            focused: false,
            value: '',
            history: [],
            historyIndex: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    nextHistory() {
        const history = this.state.history;
        const currentIndex = this.state.historyIndex;

        if (history.length === 0)
            return;

        let newIndex;
        if (currentIndex === null) {
            newIndex = history.length - 1;
        } else {
            newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = history.length - 1;
            }
        }

        this.setState({
            historyIndex: newIndex,
            value: this.state.history[newIndex],
        });
    }

    submit() {
        const value = this.state.value;
        let history = [...this.state.history];
        if (!this.state.history.includes(value))
            history.push(value);

        this.setState({
            history,
            value: '',
            historyIndex: null,
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
            case 'ArrowUp':
                e.preventDefault();
                this.nextHistory();
                break;
        }
    }

    renderCaret() {
        if (!this.state.focused)
            return null;

        return (
            <Caret />
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
};


class Terminal extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            focused: true,
            messages: [],
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();

        if (window.getSelection().type !== 'Range')
            this.input.current.focus();
    }

    renderMessages() {
        return this.props.messages.map((message, index) => <div key={index}>{message}</div>);
    }

    render() {
        return (
            <div tabIndex="-1" className="terminal" onFocus={this.handleClick}>
                {this.renderMessages()}
                <Input ref={this.input} onInput={this.props.onInput} />
            </div>
        );
    }
}

Terminal.propTypes = {
    messages: PropTypes.array.isRequired,
    onInput: PropTypes.func.isRequired,
};

export default Terminal;