import nodeExternals from 'webpack-node-externals';

export default {
  target: 'node',
  externals: [nodeExternals()],
  resolve: {
    extensions: [' ', '.js'],
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
    ],
  },
};
