const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    home: './home/index.jsx',
    product: './product/index.jsx'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: "/dist/",
    filename: '[name]-bundle.js',
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  }

};