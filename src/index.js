import React, {
    useState,
    useEffect
} from 'react';
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
    const [gfx, setGfx] = useState(Array(64 * 32).fill(0));

    useEffect(() => {
        const interval = setInterval(() => {
            const newGfx = [];
            for (let i = 0; i < 64 * 32; i++) {
                newGfx.push(Math.round(Math.random()));
            }

            setGfx(newGfx);
        }, 250);

        return () => {
            clearInterval(interval);
        };
    }, [setGfx]);

    return (
        <HorizontalResizer>
            { (left, right) =>
                <React.Fragment>
                    <ResizerPanel {...left}>
                        <Editor />
                    </ResizerPanel>
                    <ResizerPanel {...right}>
                        <Screen gfx={gfx} />
                    </ResizerPanel>
                </React.Fragment>
            }
        </HorizontalResizer>
    );
};


ReactDOM.render(
    <App />,
    document.getElementById('app'));
