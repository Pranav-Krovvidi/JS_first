const path = require('path');

module.exports = {
  mode: 'production',
  entry: './inter.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'script.js'
  },
  target: 'web'
};
