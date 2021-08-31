import * as Webpack from 'webpack'

import HtmlPlugin from 'html-webpack-plugin'

/**
 * \@types/webpack-dev-server 依赖webpack4的定义
 * 引用进来ts直接和webpack5的定义冲突爆炸
 * 直接自己定义一份了
 */
interface WebpackDevServerOptions {
  devServer: {
    contentBase: string
    host: string
    port: number
  }
}
const path = require("path")
function srcPath(subdir: string) {
  return path.join(__dirname, "../", subdir);
}
const webpackOptions: Webpack.Configuration & WebpackDevServerOptions = {
  externals:{
    'sqlite3':'commonjs sqlite3'
  },
  mode: 'development',
  target: 'electron-renderer',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      "@": srcPath('src')
    }
  },
  output: {
    publicPath: '/'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './',
    host: 'localhost',
    port: 80,
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [

          {
            loader: 'style-loader',
            options: {
              esModule: false,
              modules: {
                namedExport: false,
              },
            },
          },
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              modules: {
                namedExport: false,
                exportLocalsConvention: 'asIs',
                localIdentName: '[local]_[hash:base64:5]'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              }
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.glsl$/i,
        use: 'raw-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './index.html'
    }),
  ]
}

export default webpackOptions