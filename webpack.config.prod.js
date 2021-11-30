var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
require('dotenv').config({ path: './.env' });

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    }),
    new webpack.EnvironmentPlugin([
      'JWT_SECRET',
      'USER',
      'MYSQL_ROOT_PASSWORD', 
      'MYSQL_DATABASE',
      'DIALECT',
      'READ_PORT',
      'READ_ONLY_DB',
      'MASTER_DB',
      'WRITE_PORT',
      'REDIS_PORT',
      'REDIS_HOST',
      'NODE_ENV'
    ])
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  externals: nodeModules,
};
