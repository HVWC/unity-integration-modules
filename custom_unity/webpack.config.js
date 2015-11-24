module.exports = {
  entry: "./custom_unity.js",
  output: {
    filename: "./DrupalBehaviorsBundled.js"
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        exclude: /(bower_components)/,
        loader: 'json-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
//devtool: 'source-map',
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
};

