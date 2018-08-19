import React from 'react'; // eslint-disable-line no-unused-vars
import Button from 'chip8/components/button.js'; // eslint-disable-line no-unused-vars
import loadRom from 'chip8/utils/rom.js';

class Loader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };

        this.fileSelectorRef = React.createRef();
        this.handleLoad = this.handleLoad.bind(this);
        this.handleFileSelected = this.handleFileSelected.bind(this);
        this.onLoad = this.onLoad.bind(this);
    }

    handleLoad() {
        this.fileSelectorRef.current.click();
    }

    handleFileSelected(e) {
        e.preventDefault();

        this.setState({isLoading: true});

        const file = e.target.files[0];
        loadRom(file, this.onLoad);
    }

    onLoad(rom) {
        this.props.onLoad(rom);
        this.setState({isLoading: false});
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Button
                    disabled={true}
                    spin={true}
                    icon='spinner' />
            );
        }
        return (
            <React.Fragment>
                <Button
                    onClick={this.handleLoad}
                    icon='folder-open'/>
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
