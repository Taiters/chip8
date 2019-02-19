import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

import Menu from 'chip8/components/Menu';
import RomList from 'chip8/components/RomList';
import features from 'chip8/config/features.js';
import { setView } from 'chip8/app/actions/sidePanel.js';

import styles from './styles.js';


class SidePanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: features.sidePanelOpenAtStart,
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

    renderToggle() {
        if (!features.toggleSidePanel) {
            return null;
        }

        const icon = this.state.open ? 'caret-left' : 'caret-right';
        return (
            <div className={this.props.classes.control} onClick={() => this.toggleOpen()}>
                <FontAwesomeIcon icon={icon} size='3x' />
            </div>
        );
    }

    renderMenu() {
        if (!features.showMenu) {
            return null;
        }

        return (
            <Menu 
                onSelect={(view) => this.props.onSelectView(view)}
                selected={this.props.view} />
        );
    }

    renderPanelView() {
        switch (this.props.view) {
            case 'list':
                return <RomList />;
        }
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
                { this.renderToggle() }
                { this.renderMenu() }
                <div className={this.props.classes.content}>
                    { this.renderPanelView() }
                </div>
            </div>
        );
    }
}

SidePanel.propTypes = {
    classes: PropTypes.object.isRequired,
    view: PropTypes.string.isRequired,
    onSelectView: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    view: state.sidePanel.view,
});

const mapDispatchToProps = (dispatch) => ({
    onSelectView: (view) => dispatch(setView(view)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectSheet(styles)(SidePanel));