const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('css-minimizer-webpack-plugin');
const TarserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_MODE === 'development';

const fileName = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };
  if (!isDev) {
    config.minimizer = [new OptimizeCssPlugin(), new TarserPlugin()];
  }
  return config;
};

const cssLoader = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    'css-loader',
  ];
  if (extra) loaders.push(extra);
  return loaders;
};
const plugins = () => {
  const plugins = [
    new HTMLWebpackPlugin({
      template: 'index.html',
      mimify: {
        collapseWhitespace: !isDev,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src', 'assets'),
          to: resolve(__dirname, 'dist/assets'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css'),
    }),
  ];
  return plugins;
};

module.exports = {
  context: resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.js',
  output: {
    filename: fileName('js'),
    path: resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss', '.ttf'],
    alias: {
      '@models': resolve(__dirname, 'src/models'),
    },
  },
  devServer: {
    port: 8080,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : false,
  optimization: optimization(),
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoader(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoader('sass-loader'),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff)/,
        use: ['file-loader'],
      },
      {
        test: /\.hbs/,
        use: ['file-loader', 'html-loader'],
      },
    ],
  },
};
