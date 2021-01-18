
module.exports = {
  entry: {
    app: "./src/assets/js/App.js",
    vendor: "./src/assets/js/Vendors.js"
  },
  mode: "production",
  output: {
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader"
      }
    ]
  }
};
