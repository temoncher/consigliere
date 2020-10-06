const path = require("path");

module.exports = function(options) {
    return {
        ...options,
        entry: [ './src/index.ts'],
        output: {
          filename: 'index.js',
          path: path.resolve(__dirname, 'dist'),
        },
    };
};