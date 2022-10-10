const webpack = require('webpack');

module.exports = {
  watch: true,
  target: 'node',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"test"',
      global: {},
      'global.GENTLY': false,
    }),
    new webpack.ProvidePlugin({
      Reflect: 'core-js/es7/reflect',
      Map: 'core-js/es7/map',
      Set: 'core-js/es7/set',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
};
