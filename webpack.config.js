module.exports = {
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, "node_modules/")],
        test: /\.js$/,
        use: ["babel-loader"]
      }
    ]
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development"
    })
  ]
};
