const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const workDir = process.cwd();

const plugins = require('./webpack.plugins');
const config = require('./webpack.const');
const isDev = process.env.NODE_ENV === 'local'; // 是否是本地开发环境

module.exports = {
  mode: 'production',
  entry: './src/app.tsx',
  output: {
    path: path.resolve(workDir, OUTPUT_PATH),
    publicPath: isDev ? '/' : process.env.PUBLIC_URL,
    filename: isDev && !hash ? '[name].js' : '[name].[hash:10].js',
    chunkFilename: '[name].[hash:10].chunk.js',
  },
  devServer: {
    hot: true,
    host: '0.0.0.0', // 同一局域网下可以使用ip+端口访问
    contentBase: `./${OUTPUT_PATH}`, // 服务运行目录
    port: config.PORT, // 本地开发端口号
    historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
    headers: { // 解决本地开发时主工程加载子工程js的跨域问题
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      pages: path.resolve(__dirname, 'src/pages'),
    },
  },
  module: {
    rules: [
      { // ts和jsx编译
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      { // scss编译
        test: /\.scss$/,
        use: [ // 从下往上执行
          // config.useInlineStyle ? 'style-loader' : MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader', // 编译scss
        ],
      },
      { // 处理图片
        test: /\.(png|jpg|jpeg|gif|svg)/,
        use: {
          loader: 'url-loader',
          options: {
            outputPath: 'images/', // 图片输出的路径
            limit: 10 * 1024, // 10k以内会进行BASE64编码，10k以外会copy到output.path/publicPath的images目录下
          },
        },
      },
      { // 处理字体
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:5].min.[ext]',
              limit: 5 * 1024, // 5k以内会进行BASE64编码，10k以外会copy到output.path/publicPath的fonts目录下
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDom',
    'react-router-dom': 'ReactRouterDom',
    '@rematch/core': 'RematchCore',
    'react-redux': 'ReactRedux',
    axios: 'Axios',
  },
  plugins,
};