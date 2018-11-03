const path = require('path');

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/js'), //必ず絶対パスで指定すること
    filename: 'bundle.js'
  }
};