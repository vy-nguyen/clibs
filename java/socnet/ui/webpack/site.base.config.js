var _         = require('lodash');
var path      = require('path');
var webpack   = require('webpack');
var argv      = require('yargs').argv;
var scripts   = require('./scripts.js');

var rootDir        = path.resolve(__dirname, '..');
var node_modules   = path.resolve(rootDir, 'node_modules');

var aliases = _.mapValues(scripts.aliases, function(scriptPath) {
    return path.resolve(rootDir + scriptPath);
});

var babel_args =
    'babel-loader?compact=true&presets[]=es2015&presets[]=react&plugins[]=transform-object-rest-spread';

module.exports = {
    context: rootDir,
    resolve: {
        alias: aliases
    },
    module: {
        loaders: [ {
            test   : /\.jsx?$/,
            loaders: (
                argv.inline && argv.hot ?
                [ 'react-hot-loader', babel_args ] : [ babel_args ]
            ),
            exclude: [
                /node_modules/,
                /bower_components/,
            ]
        }, {
            test   : /\.less$/,
            exclude: [/node_modules/],
            loader : 'style-loader!css-loader!less-loader!autoprefixer-loader?            browsers=last 10 versions'
        }, {
            test   : /\.css/,
            exclude: [/node_modules/],
            loader : 'style-loader!css-loader'
        }, {
            test   : /tests.*_test\.jsx?$/,
            loader : 'mocha-loader!babel-loader'
        }, {
            test   : /node-modules\/(jsdom|node-fetch)/,
            loader : 'null-loader'
        }, {
            test   : /(\.gif|\.png)/,
            exclude: [/node_modules/],
            loader : 'url-loader?limit=10000'
        } ],
        noParse: _.values(_.pick(aliases, scripts.noParse))
    },
    plugins: [
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name     : "vendor",
            filename : "site-vendor.js",
            minChunks: Infinity
        })
    ]
};
