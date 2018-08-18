import React from 'react'; // eslint-disable-line no-unused-vars
import Loader from 'chip8/components/loader.js'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/header.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.onRomLoaded = this.onRomLoaded.bind(this);
    }

    onRomLoaded(rom) {
        this.props.onRomLoaded(rom);
    }

    render() {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Chip8</h1>
                <Loader onRomLoaded={this.onRomLoaded} />
            </div>
        );
    }
}

export default Header;
