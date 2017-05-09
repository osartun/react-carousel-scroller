var path = require('path');

module.exports = {
  entry: './js/index.js',
  output: {
    filename: 'docs-script.js',
    path: path.resolve(__dirname, 'dist')
  }
};
