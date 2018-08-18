import React from 'react'; // eslint-disable-line no-unused-vars
import loadRom from 'chip8/utils/rom.js';
import styles from 'chip8/styles/loader.scss';

class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };

        this.fileSelectorRef = React.createRef();
        this.handleLoad = this.handleLoad.bind(this);
        this.handleFileSelected = this.handleFileSelected.bind(this);
        this.onRomLoaded = this.onRomLoaded.bind(this);
    }

    handleLoad() {
        this.fileSelectorRef.current.click();
    }

    handleFileSelected(e) {
        e.preventDefault();

        this.setState({isLoading: true});

        const file = e.target.files[0];
        loadRom(file, this.onRomLoaded);
    }

    onRomLoaded(rom) {
        this.props.onRomLoaded(rom);
        this.setState({isLoading: false});
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div
                    className={styles.loading}>
                    <i className='fa fa-spinner fa-spin'></i>
                </div>
            );
        }
        return (
            <React.Fragment>
                <button
                    onClick={this.handleLoad}
                    className={styles.button}>
                    <i className='fa fa-folder-open'></i>
                </button>
                <input 
                    type="file" 
                    ref={this.fileSelectorRef} 
                    onChange={this.handleFileSelected}
                    style={{display: 'none'}}/>
            </React.Fragment>
        );
    }
}

export default Loader;
