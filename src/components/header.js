import React from 'react'; // eslint-disable-line no-unused-vars
import styles from 'chip8/styles/header.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false
        };

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

        this.setState({loading: true});

        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = this.onFileLoaded;
        reader.readAsArrayBuffer(file);
    }

    onFileLoaded(e) {
        e.preventDefault();

        const data = new Uint8Array(e.target.result);

        this.props.onROMLoaded(data);
        this.setState({loading: false});
    }

    render() {
        const loadControl = !this.state.loading
            ? <button 
                onClick={this.handleLoad} 
                className={styles.button}><i className='fa fa-folder-open'></i></button>
            : <span className={styles.status}>Loading...</span>;
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Chip8</h1>
                {loadControl}
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
