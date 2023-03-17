const path = require("path");
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require("copy-webpack-plugin");

const someOfConfigs = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    minimize: false
  },
};

const BackendConfigs = {
  ...someOfConfigs,
  name: "Backend",
  entry: "./src/App.ts",
  target: "node",
  output: {
    filename: "backend.js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: [nodeExternals()],
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "configs"),
          to: path.resolve(__dirname, "dist", "configs"),
        },
      ],
    }),
  ],
};

module.exports = [BackendConfigs];
