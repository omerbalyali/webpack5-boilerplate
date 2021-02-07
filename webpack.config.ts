import * as path from "path";
import * as webpack from "webpack";
import * as common from "./webpack.common";

const config: webpack.Configuration = {
  mode: "development",
  entry: [
    path.resolve(__dirname, "./src/index.tsx"),
    "webpack-plugin-serve/client",
  ],
  module: {
    rules: common.rules,
  },
  resolve: {
    extensions: common.extensions.javascript,
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    chunkFilename: "[name].[contenthash].js",
    filename: "[name].[contenthash].js",
    assetModuleFilename: "[name].[contenthash][ext][query]",
  },
  plugins: common.plugins,
  watch: common.devMode,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ["node_modules/**"],
  },
  devtool: common.devMode && "inline-source-map",
  stats: "minimal",
  ...common.optimizations,
};

export default config;
