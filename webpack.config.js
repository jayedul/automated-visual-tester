const webpack = require('webpack');

module.exports = {
  mode:'production',
  entry: ['./react/dashboard/index.jsx'],
  module: {
    rules: [
      {
        test: /\.jsx$/, // Only JSX to make files distinguishable
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test:/\.(s*)css$/,
        use:['style-loader','css-loader', 'sass-loader']
     }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/assets',
    publicPath: '/',
    filename: 'dashboard.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './public/js',
    hot: true
  }
};