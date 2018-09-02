import React from 'react'; // eslint-disable-line no-unused-vars
import {Row, Column} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/disassembler.scss';


const Disassembler = (props) => {

    if (props.disassembledRom == undefined)
        return null;

    const lines = props.disassembledRom.map((line, i) => {
        return (
            <p key={i}>
                0x{line.address.toString(16)}: {line.instruction}
            </p>
        );
    });

    return (
        <Row grow="1" height="100%" scroll={true}>
            <div className={styles.container}>
                {lines}
            </div>
        </Row>
    );
};

export default Disassembler;
