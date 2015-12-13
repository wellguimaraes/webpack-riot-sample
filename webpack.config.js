var webpack = require('webpack');

module.exports = {
  entry: "./app/index.js",
  output: {
    path: __dirname + '/public/bundles',
    filename: '[name]/bundle.js',
    chunkFilename: '[id]/bundle.js',
    publicPath: 'https://preview.c9users.io/wellguimaraes/webpack-sample/public/bundles/'
  },
  plugins: [
    new webpack.ProvidePlugin({ riot: 'riot' })
  ],
  module: {
    preLoaders: [
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs-loader', query: { type: 'none' } }
    ],
    loaders: [
      { test: /\.scss$/, loaders: ["style", "css", "sass"] }
    ]
  },
  devServer: {
    contentBase: './public'
  }
};