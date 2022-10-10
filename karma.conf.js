const webpack = require('webpack');
const webpackConfig = require('./webpack.config.test');

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    colors: true,
    reporters: ['mocha'],
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'src/**/*.ts',
    ],
    preprocessors: {
      'src/**/*.ts': ['webpack'],
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
    },
  });
};
