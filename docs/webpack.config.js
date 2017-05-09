var path = require('path');

module.exports = {
  entry: './js/index.js',
  output: {
    filename: 'docs-script.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
