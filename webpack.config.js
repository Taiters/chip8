const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
                test: /.(ttf|otf|eot|svg|woff2?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: '/fonts'
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
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ]
};

