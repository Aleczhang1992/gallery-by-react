'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

let precss       = require('precss');
let autoprefixer = require('autoprefixer');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: defaultSettings.getDefaultModules(),
    postcss: function () {
        return [precss, autoprefixer];
    }
});

// Add needed loaders to the defaults here
config.module.loaders.push([
	{
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
},
{
  test: /\.css$/,
  loader: "style-loader!css-loader!postcss-loader",
  //解析生效目录
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
},
{
  test: /\.json$/,
  loader: "json-loader",
}]
	);



module.exports = config;
