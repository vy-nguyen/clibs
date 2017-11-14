var _          = require('lodash');
var path       = require('path');
var webpack    = require('webpack');
var Clean      = require('clean-webpack-plugin');
var baseConfig = require('./tvntd.base.config')

var scripts    = require('./scripts');
var app_main   = {
    "tvntd-bundle": path.resolve(__dirname, '../tvntd/main.jsx'),
    "tvntd-ads"   : path.resolve(__dirname, '../tvntd/ads-main.jsx')
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
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ].concat(baseConfig.plugins)
});

module.exports = config;
