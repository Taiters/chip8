import React from 'react'; // eslint-disable-line no-unused-vars
import {classNames} from 'chip8/utils/component.js';
import styles from 'chip8/styles/button.scss';

const Button = (props) => {
    const iconClass = classNames({
        'fa': true,
        ['fa-' + props.icon]: true,
        'fa-spin': props.spin,
    });
    const buttonClass = classNames({
        [styles.button]: true,
        [styles.active]: !props.disabled,
    });
    return (
        <button
            onClick={props.onClick}
            className={buttonClass}>
            <i className={iconClass}></i>
        </button>
    );
};

export default Button;
