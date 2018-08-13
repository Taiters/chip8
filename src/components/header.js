import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/header.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.fileSelectorRef = React.createRef();
        this.handleLoad = this.handleLoad.bind(this);
        this.handleFileSelected = this.handleFileSelected.bind(this);
        this.onFileLoaded = this.onFileLoaded.bind(this);
    }

    handleLoad() {
        this.fileSelectorRef.current.click();
    }

    handleFileSelected(e) {
        e.preventDefault();

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = this.onFileLoaded;
        reader.readAsArrayBuffer(file);
    }

    onFileLoaded(e) {
        e.preventDefault();

        const data = new Uint8Array(e.target.result);

        this.props.onROMLoaded(data);
    }

    render() {
        return (
            <div className={styles.header}>
                <h1 className={styles.header__title}>Chip8</h1>
                <button 
                    onClick={this.handleLoad} 
                    className={styles.header__button}>Load</button>
                <input 
                    type="file" 
                    ref={this.fileSelectorRef} 
                    onChange={this.handleFileSelected}
                    style={{display: 'none'}}/>
            </div>
        );
    }
}

export default Header;
