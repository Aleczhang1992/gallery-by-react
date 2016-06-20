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
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ],
  module: defaultSettings.getDefaultModules(),
   postcss: function () {
        return [precss, autoprefixer];
    }
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel-loader',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});
//config.module.loaders.push({
//test: /\.css$/,
//loader: "style-loader!css-loader!postcss-loader",
////解析生效目录
//include: [].concat(
//  config.additionalPaths,
//  [ path.join(__dirname, '/../src') ]
//)
//});
config.module.loaders.push({
  test: /\.json$/,
  loader: "json-loader",
});



module.exports = config;
