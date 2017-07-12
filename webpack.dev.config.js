module.exports = {
  entry: [
    'webpack-dev-server/client?https://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    './src/index.js' // Your appʼs entry point
  ],
  output: { 
    path: './dist',
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
        loaders: ['react-hot','babel?presets[]=react,presets[]=es2015,presets[]=react-hmre']
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    stats: { colors: true },
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: './dist',
     headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id, Content-Length, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
}
  }
};