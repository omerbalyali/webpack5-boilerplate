import * as path from "path";
import * as glob from "glob";
import * as webpack from "webpack";
import * as argv from "webpack-nano/argv";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
import { WebpackPluginServe } from "webpack-plugin-serve";
const StylelintWebpackPlugin = require("stylelint-webpack-plugin");
// const PurgeCssWebpackPlugin = require("purgecss-webpack-plugin");
import * as cssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
// const webpackObfuscatorPlugin = require("webpack-obfuscator");
import * as compressionWebpackPlugin from "compression-webpack-plugin";
import {
  WebpackManifestPlugin,
  Options as WebpackManifestOptions,
} from "webpack-manifest-plugin";

const mode = argv.mode;
const devMode = argv.mode !== "production" ? true : false;

const javascriptExtensions = [".ts", ".tsx", ".js", ".jsx"];

const javascriptRule: webpack.RuleSetRule = {
  test: /\.(ts|tsx|js|jsx)$/,
  exclude: /node_modules/,
  use: ["babel-loader"],
};

const cssRule: webpack.RuleSetRule = {
  test: /\.css$/,
  use: [
    // { loader: 'style-loader' },
    { loader: MiniCssExtractPlugin.loader },
    {
      loader: "css-loader",
      options: { importLoaders: 1, modules: true, sourceMap: true },
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          config: true,
        },
        sourceMap: true,
      },
    },
  ],
};

const imagesRule: webpack.RuleSetRule = {
  test: /\.(png|jpg)$/,
  type: "asset",
  parser: { dataUrlCondition: { maxSize: 15000 } },
};

const svgRule: webpack.RuleSetRule = {
  test: /\.svg$/,
  type: "asset",
};

const stylelintOptions = {
  files: "./src/**/*.css",
  emitError: true,
  emitWarning: true,
  failOnError: true,
  failOnWarning: true,
};
// const purgeCssOptions = {
//   paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }),
// };

const HtmlPluginOptions: HtmlWebpackPlugin.Options = {
  template: path.resolve(__dirname, "./public/index.html"),
};
const devServerOptions = {
  port: 8080,
  static: "./dist",
  liveReload: true,
  waitForBuild: true,
  progress: false,
};
const compressionOptions: compressionWebpackPlugin.Options<any> = {
  algorithm: "gzip",
  include: /\/.(css|js)/,
  deleteOriginalAssets: true,
};
const manifestOptions: WebpackManifestOptions = {};

const extensions = { javascript: javascriptExtensions };
const plugins = [
  new StylelintWebpackPlugin(stylelintOptions),
  devMode ? new WebpackPluginServe(devServerOptions) : () => null,
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
  }),
  // new PurgeCssWebpackPlugin(purgeCssOptions),
  new HtmlWebpackPlugin(HtmlPluginOptions),
  !devMode ? new WebpackManifestPlugin(manifestOptions) : () => null,
  // !devMode
  //   ? new webpackObfuscatorPlugin({ rotateStringArray: true }, [
  //       "**vendor**.js",
  //     ])
  //   : () => null,
  !devMode ? new compressionWebpackPlugin(compressionOptions) : () => null,
];
const optimizations: webpack.Configuration = {
  optimization: {
    minimize: true,
    minimizer: [
      compiler =>
        new cssMinimizerWebpackPlugin({
          minimizerOptions: { preset: ["default", {}] },
        }),
      `...`,
    ],
    splitChunks: {
      chunks: "all",
      minSize: { javascript: 20000, "css/mini-extra": 10000 },
    },
  },
};

const rules = [javascriptRule, cssRule, imagesRule, svgRule];

export { mode, devMode, extensions, plugins, rules, optimizations };
