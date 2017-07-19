module.exports = {
  entry: [
    './src/index.js' // Your appʼs entry point
  ],
  output: { 
    path: './public/js/app',
    filename: 'bundle.js',
    //publicPath: pathPublicCDN
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015']
      }
    ]
  },
  devtool: 'cheap-eval-source-map',

};var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js' // Your appʼs entry point
  ],
  output: { 
    path: './public/js/app',
    filename: 'bundle.js',
    //publicPath: pathPublicCDN
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015']
      }
    ]
  },
  devtool: 'cheap-eval-source-map',

};