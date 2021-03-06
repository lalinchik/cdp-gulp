const path = require('path');
const webpack = require('webpack');
const SpritesmithPlugin = require('webpack-spritesmith');
const CopyPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const nodeEnv = process.env.NODE_ENV;
const production = nodeEnv && nodeEnv.indexOf('prod') > -1;
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const config = {
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  },
  debug: true,
  devtool: 'source-map',
  entry: ['./src/entry.js'],
  output: {
    path: './dist',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.png$/, loader: 'file?name=images/sprite.png' },
      { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/ },

      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=1024&name=fonts/[name].[ext]',
      },
    ],
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main']) //eslint-disable-line
    ),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, 'src/images'),
        glob: '*.png',
      },
      target: {
        image: path.resolve(__dirname, 'tmp/sprite.png'),
        css: path.resolve(__dirname, 'tmp/sprite.less'),
      },
      apiOptions: {
        cssImageRef: '~sprite.png',
      },
    }),
    new CopyPlugin([
      { from: './src/index.html' },
      { from: './src/images/logo_gray-blue_80px.svg', to: 'images/logo_gray-blue_80px.svg' },
    ]),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'prod',
      pngquant: {
        quality: '95-100',
      },
    }),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: ['src/**/*.less'],
    }),
  ],
  devServer: {
    contentBase: './src',
  },
};

if (production) {
  config.module.loaders.push({
    test: /\.less$/,
    loader: 'style-loader!css-loader!csso-loader!autoprefixer-loader?browsers=last 2 version!less-loader',
  });
} else {
  config.module.loaders.push({ test: /\.less$/, loader: 'style-loader!css-loader!less-loader' });
}

module.exports = config;
