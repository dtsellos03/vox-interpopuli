var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: [
    path.join(__dirname, 'src' , 'index.js')
  ],
  output: { 
        path: path.resolve(__dirname + '/public/js/app'),
        filename: 'bundle.js',
        publicPath: '/js/app/'
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use:[{
              loader: 'babel-loader', options: {
                    presets: ['react', 'es2015']
                                         }
            }]
      }
    ]
  },
  devtool: 'cheap-eval-source-map',

};
