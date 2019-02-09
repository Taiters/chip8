import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

const styles = (theme) => ({
    '@keyframes open': {
        from: {
            marginLeft: '-602px',
        },
        to: {
            marginLeft: '0px',
        },
    },
    '@keyframes close': {
        from: {
            marginLeft: '0px',
        },
        to: {
            marginLeft: '-602px',
        },
    },
    container: {
        backgroundColor: theme.palette.secondary.darker,
        position: 'relative',
        boxShadow: '0px 0px 15px 10px #00000050',
        width: '600px',
        marginRight: '58px',
        height: '100%',
        '@media (max-width: 576px)': {
            display: 'none'
        },
        borderRight: '2px solid ' + theme.palette.secondary.darkest,
    },
    open: {
        marginLeft: '0px',
    },
    closed: {
        marginLeft: '-602px',
        marginRight: '0px',
        boxShadow: '0px 0px 15px 10px #00000000',
    },
    control: {
        position: 'absolute',
        top: '32px',
        right: '-52px',
        width: '50px',
        height: '50px',
        borderRadius: '0 8px 8px 0',
        backgroundColor: theme.palette.secondary.darker,
        cursor: 'pointer',
        border: '2px solid ' + theme.palette.secondary.darkest,
        borderLeft: 'none',
        boxShadow: '0px 0px 15px 10px #00000050',
        '&:before': {
            content: '""',
            position: 'absolute',
            left: '-30px',
            top: '-30px',
            height: '110px',
            width: '30px',
            backgroundColor: theme.palette.secondary.darker,
            cursor: 'default',
        }
    },
    inner: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        padding: '8px',
    },
    editor: {
        padding: '8px',
        border: '2px solid ' + theme.palette.secondary.base,
        backgroundColor: theme.palette.secondary.darkest,
        color: 'white',
        flexGrow: 1,
    }
});

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            toggled: false,
        };

        this.toggleOpen.bind(this);
    }

    toggleOpen() {
        const isOpen = this.state.open;
        this.setState({
            open: !isOpen,
            toggled: true,
        });
    }

    render() {
        const containerStyle = {};
        let containerClass = this.props.classes.container;
        if (this.state.open) {
            containerClass += ' ' + this.props.classes.open;

            if (this.state.toggled) {
                containerStyle['animation'] = 'open 0.2s';
            }
        } else {
            containerClass += ' ' + this.props.classes.closed;

            if (this.state.toggled) {
                containerStyle['animation'] = 'close 0.2s';
            }
        }

        return (
            <div className={containerClass} style={containerStyle}>
                <div className={this.props.classes.control} onClick={() => this.toggleOpen()}/>
                <div className={this.props.classes.inner}>
                    <div className={this.props.classes.editor}>
                        <p>Working on it...</p>
                        <p>Any minute now :)</p>
                        <p>Or day</p>
                        <br/>
                        <p>...Next week maybe</p>
                    </div>
                </div>
            </div>
        );
    }
}

Editor.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default injectSheet(styles)(Editor);