var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// require('dotenv').config({ path: './.env' });
const Dotenv = require('dotenv-webpack');
// const config = require('./src/config/config')
// var { master_db } = config.mysql.production

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  mode: "production",
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
    new Dotenv()
    // new Dotenv({
    //   path: path.resolve(process.cwd(), './.env'),
    // })
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
