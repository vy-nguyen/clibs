var _          = require('lodash');
var path       = require('path');
var webpack    = require('webpack');
var root_dir   = path.resolve(__dirname, '../../../');
var scripts    = require(path.resolve(__dirname + '/scripts'));
var app_test   = {
    "tvntd-test": path.resolve(__dirname, '../tests/main.jsx')
};

module.exports = {
    context: root_dir,
    entry  : _.merge(app_test, scripts.chunks),
    resolve: {
        alias: _.mapValues(scripts.aliases, function(script_path) {
            return path.resolve(root_dir + script_path);
        })
    },
    output: {
        path    : path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    }
};
