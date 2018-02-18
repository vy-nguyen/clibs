var _          = require('lodash');
var path       = require('path');
var webpack    = require('webpack');
var baseConfig = require('./site.base.config.js');
var scripts    = require('./scripts.js');
var app_main   = {
    "site": path.resolve(baseConfig.context, 'js/index.js')
};

var config = _.merge(baseConfig, {
    entry  : _.merge(app_main, scripts.chunks),
	output: {
		filename  : '[name].js',
		path      : path.resolve(baseConfig.context, 'dist'),
        pathinfo  : true,
        publicPath: 'http://localhost:8081/dist/',
        chunkFilename: 'chunk.[id].js'
	},
    devtool: 'cheap-module-source-map',
	plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ].concat(baseConfig.plugins)
});

console.log(config.output.path);

module.exports = config;
