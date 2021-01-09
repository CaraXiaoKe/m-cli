const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function({loaders: loadersOption, useInlineStyle}){
    const urlLoaderOptions = loadersOption['url-loader'] || {
        images: {},
        fonts: {}
    }
    return [
        { // ts和jsx编译
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: [
              require('@babel/preset-env'),
              require('@babel/preset-react'),
              require('@babel/preset-typescript'),
            ],
            plugins: [

            ]
          }
        },
        { // scss编译
          test: /\.scss$/,
          use: [ // 从下往上执行
            useInlineStyle ? 'style-loader' : MiniCssExtractPlugin.loader,
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader', // 编译scss
          ],
        },
        { // scss编译
          test: /\.css$/,
          use: [ // 从下往上执行
            'style-loader',
            'css-loader',
          ],
        },
        { // 处理图片
          test: /\.(png|jpg|jpeg|gif|svg)/,
          use: {
            loader: 'url-loader',
            options: Object.assign({
              outputPath: 'images/', // 图片输出的路径
              limit: 10 * 1024, // 10k以内会进行BASE64编码，10k以外会copy到output.path/publicPath的images目录下
            }, urlLoaderOptions.images),
          },
        },
        { // 处理字体
          test: /\.(eot|woff2?|ttf|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: Object.assign({
                name: '[name]-[hash:5].min.[ext]',
                limit: 5 * 1024, // 5k以内会进行BASE64编码，10k以外会copy到output.path/publicPath的fonts目录下
                outputPath: 'fonts/',
              }, urlLoaderOptions.fonts),
            },
          ],
        },
    ];
}