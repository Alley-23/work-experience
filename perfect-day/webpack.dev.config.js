var webpack = require('webpack');
var postcssImport = require('postcss-import');
var postcssUrl = require('postcss-url');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var fs = require('fs');

var config = {
    "dest": "./build"
};

try {
    fs.accessSync('./.config.json', fs.R_OK);
    config = require('./.config.json');
} catch(ex) {
    // ignore
}

module.exports = {
    entry: {
        app: './view/index.js',
        lib: [
            'object-assign',
            'react',
            'react-dom',
            'react-redux',
            'react-router',
            'redux',
            'redux-thunk',
            'superagent',
            'underscore'
        ]
    },
    output: {
        path: config.dest,
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
            },
            {
                test: /\.(eot|ttf|woff|woff2)/,
                loader: 'file-loader?name=./[name]-[hash].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=10000&name=[name]-[hash].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js'),
        new ExtractTextPlugin("index.css")
    ],
    postcss: function (webpack) {
        return [
            postcssImport({
                addDependencyTo: webpack
            }),
            postcssUrl()
        ];
    }
};