import React from 'react'; // eslint-disable-line no-unused-vars
import Header from 'chip8/components/header.js'; // eslint-disable-line no-unused-vars
import Screen from 'chip8/components/screen.js'; // eslint-disable-line no-unused-vars

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleROMLoaded = this.handleROMLoaded.bind(this);
    }

    handleROMLoaded(romData) {
        this.setState({romData});
    }

    render() {
        return (
            <React.Fragment>
                <Header onROMLoaded={this.handleROMLoaded}/>
                <Screen romData={this.state.romData}/>
            </React.Fragment>
        );
    }
}

export default App;
