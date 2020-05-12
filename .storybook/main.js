const path = require('path');


module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    config['resolve']['alias']['chip8'] = path.resolve(__dirname, '..', 'src');
    return config;
  },
};
