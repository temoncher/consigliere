const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = function(options) {
    return {
        ...options,
        entry: [ './src/index.ts'],
        output: {
          filename: 'index.js',
          path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
          ...options.resolve,
          plugins: [new TsconfigPathsPlugin()],
        }
    };
};