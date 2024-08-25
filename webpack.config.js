const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


const version = process.env.TRAVIS_BUILD_NUMBER || 'local';

module.exports = {
    entry: [
        './src/index.js',
    ],
    resolve: {
        alias: {
            chip8: path.resolve(__dirname, 'src'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images/',
                    },
                }]
            },
            {
                test: /\.(txt)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'examples/',
                    }
                }]
            },
            {
                test: /\.jsx?$/,
                    use: [
                        'babel-loader',
                    ]
            },
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            templateParameters: {
                version: version
            },
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src', 'static'), to: path.resolve(__dirname, 'dist') },
            ],
        }),
    ]
};
