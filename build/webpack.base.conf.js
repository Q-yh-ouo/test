'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf');
const webpack = require("webpack")

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const AutoDllPlugin = require('autodll-webpack-plugin')
const dllEntry = require('./dll-entry')


module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        include: [resolve('src')],
        exclude: [resolve('node_modules'), resolve('src/views/home/index.vue')],
        loader: 'eslint-loader',
        options: {
          fix: true,
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory=true',
        // 处理 lesso-common 编译问题,
        // 直接包含lesso-common的话会带上node_modules,
        // 所以要加一下排除
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client'), resolve('node_modules/lesso-common')],
        exclude: [resolve('node_modules/lesso-common/node_modules')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  // plugins: [
  //   new AutoDllPlugin({
  //     plugin:[
  //       new webpack.optimize.UglifyJsPlugin()
  //     ],
  //     inject: true,
  //     filename: '[name].dll.[hash].js',
  //     context: path.resolve(__dirname,'../'),//AutoDllPlugin的context必须要与package.json属于同级目录
  //     entry: dllEntry
  //   })
  // ]
}
