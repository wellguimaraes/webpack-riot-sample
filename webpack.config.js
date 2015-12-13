var webpack = require('webpack');

module.exports = {
  entry: {
      main: "./app/main.js"
  },
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
      
    ],
    loaders: [
        { test: /\.tag$/, loader: 'riotjs-loader' },
      { test: /\.scss$/, loaders: ["style", "css", "sass"] }
    ]
  }
};