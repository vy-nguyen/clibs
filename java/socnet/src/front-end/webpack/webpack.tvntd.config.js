var _          = require('lodash');
var path       = require('path');
var webpack    = require('webpack');
var Clean      = require('clean-webpack-plugin');
var baseConfig = require('./tvntd.base.config')

var scripts    = require('./scripts');
var app_main   = {
    "tvntd"     : path.resolve(scripts.rootSrc, 'tvntd/main.jsx'),
    "tvntd-ads" : path.resolve(scripts.rootSrc, 'tvntd/app-main/ads-main.jsx'),
    "business"  : path.resolve(scripts.rootSrc, 'tvntd/app-main/business-main.jsx')
};

var config =  _.merge(baseConfig, {
    entry: _.merge(app_main, scripts.chunks),

    output: {
        path         : path.resolve(scripts.webRoot, 'client'),
        filename     : '[name].js',
        publicPath   : 'client/',
        chunkFilename: 'chunk.[id].js',
        pathinfo     : true
    },
    devtool: 'cheap-module-source-map ',
    plugins: [
        new Clean(path.resolve(scripts.webRoot, 'client')),
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
        new webpack.optimize.CommonsChunkPlugin({
            name     : "common",
            chunks   : [
                "tvntd",
                "tvntd-ads",
                "business",
                "vendor",
                "vendor.lib",
                "vendor.datatables"
            ],
            minChunks: function(module) {
                return module.context && module.context.includes("node_modules");
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ].concat(baseConfig.plugins)
});

module.exports = config;
