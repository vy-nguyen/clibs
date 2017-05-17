var _          = require('lodash');
var path       = require('path');
var webpack    = require('webpack');
var Clean      = require('clean-webpack-plugin');
var baseConfig = require('./tvntd.base.config')

var scripts    = require('./scripts');
var app_main   = {
    "tvntd-bundle": path.resolve(__dirname, '../tvntd/main.jsx')
};

var config =  _.merge(baseConfig, {
    entry: _.merge(app_main, scripts.chunks),

    output: {
        path         : path.resolve(__dirname, '../../main/webapp/client'),
        filename     : '[name].js',
        publicPath   : 'client/',
        chunkFilename: 'chunk.[id].js',
        pathinfo     : true
    },
    devtool: 'cheap-module-source-map ',
    plugins: [
        new Clean('../../main/webapp/client'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            minimize : false,
            sourceMap: false,
            exclude: [
                /node_modules/,
                /bower_components/
            ]
        }),
        /*
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
        */
    ].concat(baseConfig.plugins)
});

module.exports = config;
