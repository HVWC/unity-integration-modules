module.exports = {
  entry: "./unit-tests.js",
  output: {
    filename: "./BundledTests.js"
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?optional=runtime'
      }
    ]
  },
  devtool: '#inline-source-map',
};

