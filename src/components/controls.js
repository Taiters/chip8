import React from 'react'; // eslint-disable-line no-unused-vars
import {Row} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars
import Button from 'chip8/components/button.js'; // eslint-disable-line no-unused-vars
import Loader from 'chip8/components/loader.js'; // eslint-disable-line no-unused-vars

const Controls = (props) => {
    const playDisabled = !props.romLoaded;
    const stepDisabled = !props.romLoaded || props.running;
    const stopDisabled = !props.romLoaded;
    const playPauseButton = props.running
        ? <Button 
            disabled={playDisabled}
            onClick={props.onPause} 
            icon='pause' />
        : <Button 
            disabled={playDisabled}
            onClick={props.onRun}
            icon='play' />;

    return (
        <Row>
            {playPauseButton}
            <Button 
                onClick={props.onStep}
                disabled={stepDisabled} 
                icon='step-forward' />
            <Button 
                onClick={props.onStop}
                disabled={stopDisabled}
                icon='stop' />
            <Loader onLoad={props.onLoad}/>
        </Row>   
    );
};

export default Controls;
