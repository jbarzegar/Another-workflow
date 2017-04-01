const webpack = require('webpack')

const config = {
  filename: 'main.js',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: `${__dirname}/build`
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      babelrc: false,
      presets: [
        [ 'es2015', { modules: false } ]
      ]
    }]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
}

module.exports = config
