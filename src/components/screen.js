import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/screen.scss';

const Screen = (props) => {
    if (!props.romData) {
        return (
            <div className={styles.screen}>
                No data :(
            </div>
        );
    }

    let formattedData = [];
    for (let i in props.romData) {
        let value = props.romData[i].toString(16).padStart(2, '0');
        formattedData.push(<span className={styles.screen__data}>{value}</span>);
    }

    return (
        <div className={styles.screen}>
            {formattedData}
        </div>
    );
};

export default Screen;
