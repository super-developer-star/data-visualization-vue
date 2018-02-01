'use strict';
var path = require('path');
var ProvidePlugin = require('webpack').ProvidePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var purify = require('purifycss-webpack-plugin');
var config = require('../config');
var utils = require('./utils');
var projectRoot = path.resolve(__dirname, '../');
var ImageminPlugin = require('imagemin-webpack-plugin').default;



module.exports = {

  entry: {
    app: './src/main.js',
    vendor:[]
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['', '.js', '.vue','.css', '.json', '.tsv', '.csv'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue': 'vue/dist/vue',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: [/node_modules/,/js/]
      }
    ],
    loaders: [
     {
       test: /\.html$/,
       loader: "html"
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: "file-loader?name=static/api/[name].[ext]"
      },
      {
        test: /\.tsv/,
        loader: "file-loader?name=static/api/[name].[ext]"
      },
      {
        test: /\.csv/,
        loader: "file-loader?name=static/api/[name].[ext]"
      },
      { test: /\.css$/,
        include: path.resolve(__dirname, "not_exist_path"),
        loaders: [ 'style', 'css' ]
      },
      {
          test: /\.(png|jpg|gif|ico)$/,
          loader: "file-loader?name=static/img/[name].[ext]"
      },
      {
        test: /\.(svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  vue: {
    loaders: utils.cssLoaders(),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  },
  plugins: [
            new purify({
                basePath: __dirname,
                paths: [
                    "../src/*.html",
                    "../src/components/templates/*.html"
                ],
                purifyOptions:{
                    minify:true,
                    reject: true
                }
            }),
            new ImageminPlugin({
                disable: process.env.NODE_ENV !== 'production', // Disable during development
                pngquant: {
                  quality: '95-100'
                }
              })

        ]
}
