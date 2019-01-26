const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const version = process.env.TRAVIS_BUILD_NUMBER || 'local';


module.exports = {
    entry: [
        './src/index.js',
    ],
    mode: 'development',
    resolve: {
        alias: {
            chip8: path.resolve(__dirname, 'src'),
            handlebars: 'handlebars/dist/handlebars.min.js',
        }
    },
    module: {
        rules: [
            {
                test: /.(rom|ch8)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'roms/',
                        publicPath: 'roms'
                    }
                }]
            },
            {
                test: /.(ttf|otf|eot|svg|woff2?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: 'fonts'
                    }
                }]
            },
            {
                test: /\.jsx?$/,
                    use: [
                        'babel-loader',
                        'eslint-loader',
                    ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
        ],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        port: 9000,
        proxy: {
            '/api': 'http://localhost:3000'
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            templateParameters: {
                version: version
            },
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'roms'),
            to: path.resolve(__dirname, 'dist/roms'),
        }]),
    ]
};

