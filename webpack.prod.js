var path = require('path');
var webpack = require('webpack');

console.log(path.join(__dirname, 'src/frontend' , 'index.html'));

module.exports = {
  devtool: 'source-map',
  entry: [
    path.join(__dirname, 'src' , 'index.js')
  ],
  output: {
        path: path.resolve(__dirname + '/public/js/app'),
        filename: 'bundle.js',
        publicPath: '/js/app/'
  },
  plugins: [ 
  //   new webpack.optimize.CommonsChunkPlugin('common'),
  // new webpack.optimize.DedupePlugin(),
  // new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
  new webpack.optimize.AggressiveMergingPlugin()
  ],

  module: {
       loaders: [
      {
    test: /\.jsx?$/,
              loader: ['babel'],
      query: {
        presets: ['react', 'es2015']
      }
        
      }
    ]
  }
};

  
