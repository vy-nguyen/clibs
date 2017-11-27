var _          = require('lodash');
var path       = require('path');
var root_dir   = path.resolve(__dirname, '../../../');
var scripts    = require(path.resolve(__dirname + '/scripts.js'));
var baseConfig = require('./tvntd.base.config.js');
var app_test   = {
    "tvntd-test": path.resolve(__dirname, '../tests/main.js')
};

module.exports = _.merge(baseConfig, {
    context: root_dir,
    entry  : _.merge(app_test, scripts.chunks),
    resolve: {
        alias: _.mapValues(scripts.aliases, function(script_path) {
            return path.resolve(root_dir + script_path);
        })
    },
    externals: {
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    },
    output: {
        path    : path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    }
});
