import React from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import { HorizontalResizer, ResizerPanel } from 'chip8/components/layout';
import Editor from 'chip8/components/editor';
import Screen from 'chip8/components/screen';


jss.setup(preset());
jss.createStyleSheet({
    '@global': {
        'window, html, body, .app': {
            margin: 0,
            padding: 0,
            height: '100%',
            backgroundColor: '#1D2021',
        },
    },
}).attach();


const App = () => {
    return (
        <HorizontalResizer>
            { (left, right) =>
                <React.Fragment>
                    <ResizerPanel {...left}>
                        <Editor />
                    </ResizerPanel>
                    <ResizerPanel {...right}>
                        <Screen />
                    </ResizerPanel>
                </React.Fragment>
            }
        </HorizontalResizer>
    );
};


ReactDOM.render(
    <App />,
    document.getElementById('app'));
