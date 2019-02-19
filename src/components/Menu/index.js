import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const styles = (theme) => ({
    container: {
        height: '100%',
        width: '60px',
        backgroundColor: theme.palette.secondary.darkest,
        display: 'flex',
        flexDirection: 'column',
    },
    item: {
        width: '60px',
        height: '60px',
        color: theme.palette.secondary.lighter,
        textAlign: 'center',
        lineHeight: '60px',
        cursor: 'pointer',
        fontSize: '1.1em',

        '&:hover': {
            color: theme.palette.secondary.lightest,
        }
    },
    selected: {
        backgroundColor: theme.palette.secondary.darker,
        color: theme.palette.secondary.darkest,
        cursor: 'default',

        '&:hover': {
            color: theme.palette.secondary.darkest,
        }
    }
});

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(item) {
        this.props.onSelect(item);
    }

    render() {
        const classes = this.props.classes;
        const selectedItem = this.props.selected;
        const handleSelect = this.handleSelect;
        const menuElements = ['list', 'bug'].map((name) => {
            let itemClass = classes.item;

            if (name == selectedItem) {
                itemClass += ' ' + classes.selected;
            }

            return (
                <div key={name} className={itemClass} onClick={() => handleSelect(name)}>
                    <FontAwesomeIcon icon={name} />
                </div>
            );
        });

        return (
            <div className={classes.container}>
                { menuElements }
            </div>
        );
    }
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
    selected: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default injectSheet(styles)(Menu);