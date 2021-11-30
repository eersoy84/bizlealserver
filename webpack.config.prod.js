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
    // new webpack.DefinePlugin({
    //   'JWT_SECRET': JSON.stringify(process.env.JWT_SECRET),
    //   'USER': JSON.stringify(process.env.USER),
    //   'MYSQL_ROOT_PASSWORD': JSON.stringify(process.env.MYSQL_ROOT_PASSWORD),
    //   'MYSQL_DATABASE': JSON.stringify(process.env.MYSQL_DATABASE),
    //   'DIALECT': JSON.stringify(process.env.DIALECT),
    //   'READ_PORT': JSON.stringify(process.env.READ_PORT),
    //   'READ_ONLY_DB': JSON.stringify(process.env.READ_ONLY_DB),
    //   'MASTER_DB': JSON.stringify(process.env.MASTER_DB),
    //   'WRITE_PORT': JSON.stringify(process.env.WRITE_PORT),
    //   'REDIS_PORT': JSON.stringify(process.env.REDIS_PORT),
    //   'REDIS_HOST': JSON.stringify(process.env.REDIS_HOST),
    // }),
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
