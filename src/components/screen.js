import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/screen.scss';

const messages = [
    'Thanks for coming, maybe try again tomorrow?',
    'Oh, you loaded another file. Why?',
    'Oh I see what you\'re doing. This isn\'t one of those endless message things',
    'That\'s not what this is',
    'Go do something better with your life. Build a treehouse or something',
    'Oh god, it\'s almost midnight and I\'m typing these messages...',
    'Thanks for making this about me. This was meant to be a bit of fun',
    'Honestly if you do this again I\'m just going to break'
];
let messageIndex = 0;

function nextMessage() {
    if (messageIndex >= messages.length) {
        throw 'Shit just got real, BAIL! BAIL! BAIL!';
    }
    return messages[messageIndex++];
}


const Screen = (props) => {
    if (!props.romData) {
        return (
            <div className={styles.screen}>
                <h2>No ROM loaded</h2>
                <p>Don't worry, most of this site isn't really loaded either. Not for any bad reasons, no bugs or anything. There's just nothing left to load... This is it.</p>
                <p>Release.. early?</p>
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
            <h2>Oh here we go!</h2>
            <p>No, no we're not really going anywhere. I just thought it might be nice if we shared a moment to inspect the data from this file. Just to make sure things are hooked up OK. I guess this is everything.</p>
            <p>{nextMessage()}</p>
            {formattedData}
        </div>
    );
};

export default Screen;
