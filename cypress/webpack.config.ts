import * as path from 'path';

import * as webpack from 'webpack';

export const webpackOptions: webpack.Configuration = {
  mode: 'development',
  // eslint-disable-next-line @typescript-eslint/camelcase
  node: { fs: 'empty', child_process: 'empty', readline: 'empty' },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // add the alias object
    alias: {
      '@shared': path.resolve('src/app/shared'),
      src: path.resolve('src'),
    },
  },
};
