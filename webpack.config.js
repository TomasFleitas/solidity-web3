const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            attrs: [":data-src"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
