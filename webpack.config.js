const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'], // babel-loaderがES5に変換できないpromise関数等をbabel-polyfillが変換する

  output: {
    path: path.resolve(__dirname, 'dist'), //必ず絶対パスで指定すること
    filename: 'js/bundle.js'
  },

  devServer: {
    contentBase: './dist'
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    })
  ],

  module: {
    rules: [{
      test: /\.js$/, //トランスパイルの対象とするファイル
      exclude: /node_modules/, //node_modulesをトランスパイル対象から外す
      use: { loader: 'babel-loader' }
    }]
  }
};