import React, {
    useState,
    useEffect
} from 'react';
import ReactDOM from 'react-dom';
import jss from 'jss';
import preset from 'jss-preset-default';

import Container from 'chip8/components/container';
import Header from 'chip8/components/header';
import Editor from 'chip8/components/edit';
import Display from 'chip8/components/display';


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
        <Container direction={Container.Direction.VERTICAL}>
            <Container.Child>
                <Header />
            </Container.Child>
            <Container>
                <Container.Child width="33%">
                    <Editor />
                </Container.Child>
                <Container.Child width="66%">
                    <Display gfx={gfx} />
                </Container.Child>
            </Container>
        </Container>
    );
};


ReactDOM.render(
    <App />,
    document.getElementById('app'));
