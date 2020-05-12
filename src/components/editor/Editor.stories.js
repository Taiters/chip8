import React from 'react';
import { action } from '@storybook/addon-actions';

import Editor from './Editor';
import code from 'chip8/example';

export default {
    component: Editor,
    title: 'Editor',
}

const actions = {
    onChange: action('onChange'),
    onFocus: action('onFocus'),
    onBlur: action('onBlur'),
    onGutterClick: action('onGutterClick'),
}

const errors = [
    {
        message: 'Invalid thing',
        token: {
            line: 16,
            column: 7,
            raw: 'IS_MOVING_DOWN',
        },
    },
    {
        message: 'Another thing',
        token: {
            line: 28,
            column: 12,
            raw: 'vB',
        }
    }
];

const breakpoints = [5, 10, 15, 150];


export const Default = () => <Editor code={code} {...actions} />;
export const Error = () => <Editor code={code} errors={errors} {...actions} />;
export const Breakpoints = () => <Editor code={code} breakpoints={breakpoints} {...actions} />;