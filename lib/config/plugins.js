const fs = require("fs");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('lodash');

const { NODE_ENV, analyze } = process.env;

module.exports = ({ plugins: pluginsOption, workDir, isDev, useInlineStyle}, noHash) => {
    
    pluginsOption.copy = pluginsOption.copy instanceof Array ? pluginsOption.copy : [];

    pluginsOption.define = merge({
        'process.env': {
            NODE_ENV,
            IS_DEV: isDev,
        },
    }, pluginsOption.define);
    const defineOptions = Object.keys(pluginsOption.define).reduce((o, key) => {
        o[key] = JSON.stringify(pluginsOption.define[key])
        return o;
    }, {})

    const plugins = [
        new HtmlWebpackPlugin(merge({
            filename: 'index.html', // 最终打包的文件名，默认打包到output.path目录下
            template: './public/index.ejs',
            templateParameters: {
            },
        }, pluginsOption.htmlWebpack)),
        new webpack.DefinePlugin(defineOptions)// 项目中注入全局全局变量
    ];
    if(!useInlineStyle){
        plugins.push(new MiniCssExtractPlugin({
            filename: `css/[name]${noHash ? '' : '[hash:10]'}.css`,
            chunkFilename: `css/[id]${noHash ? '' : '.[hash:10]'}.css`,
        }))
    }
    if(fs.existsSync(`${workDir}/static`)){
        const staticFiles = fs.readdirSync(`${workDir}/static`);
        if(staticFiles.length > 0){
            pluginsOption.copy.push({
                from: 'static',
                to: 'static'
            })
        }
    }
    if(pluginsOption.copy.length > 0){
        plugins.push(
            new CopyPlugin({ // 将from目录内容原封不动的copy到to目录, 适合存放尺寸较大的图片和其他文件
                patterns: pluginsOption.copy,
            }),
        )
    }

    if (!isDev) {
        plugins.push(new CleanWebpackPlugin());
        if (analyze) {
            plugins.push(new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: 'index.html',
            }));
        }
    } else {
        // 实现局部更新 https://www.webpackjs.com/guides/hot-module-replacement/
        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return plugins;
}