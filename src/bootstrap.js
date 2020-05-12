import jss from 'jss';
import preset from 'jss-preset-default';


export function bootstrapJss() {
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
};