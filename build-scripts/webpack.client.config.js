const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const pluginConfig = require('../pluginrc.js')

const distFolder = path.join(pluginConfig.destinationFolder, pluginConfig.extensionBundleId)
const srcFolder = pluginConfig.sourceFolder
const CLIENT_DIST_PATH = path.resolve(distFolder, 'client-dist')
const HTML_TEMPLATE_PATH = path.join(srcFolder, 'client-src/index.server.template.html')
const ENTRY_POINT_CLIENT_PATH = path.join(srcFolder, 'client-src/index.js')

module.exports = ({
    entry: ["regenerator-runtime/runtime.js", ENTRY_POINT_CLIENT_PATH],
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                type: 'asset/resource',
                generator: { filename: 'fonts/[name][ext]' }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(gif|jpg|png)$/,
                type: 'asset/resource',
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: CLIENT_DIST_PATH,
        publicPath: './client-dist/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        static: CLIENT_DIST_PATH
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "main.css",
            chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin({
            template: HTML_TEMPLATE_PATH,
            filename: 'index.html',
            inject: 'body',
            title: 'Liwit Translator',
        }),
    ]
})
