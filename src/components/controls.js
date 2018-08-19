import React from 'react'; // eslint-disable-line no-unused-vars
import {HorizontalGroup, Item} from 'chip8/components/layout.js'; // eslint-disable-line no-unused-vars
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
        <HorizontalGroup>
            <Item>
                {playPauseButton}
            </Item>
            <Item>
                <Button 
                    onClick={props.onStep}
                    disabled={stepDisabled} 
                    icon='step-forward' />
            </Item>
            <Item>
                <Button 
                    onClick={props.onStop}
                    disabled={stopDisabled}
                    icon='stop' />
            </Item>
            <Item>
                <Loader onLoad={props.onLoad}/>
            </Item>
        </HorizontalGroup>   
    );
};

export default Controls;
