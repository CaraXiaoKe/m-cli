const { merge } = require('webpack-merge');
const path = require('path');
const loadLoaders = require('./loaders');
const loadPlugins = require('./plugins');
module.exports =  function(mrcOptions){
    const { workDir, isDev } = mrcOptions;
    const noHash = isDev && !mrcOptions.hash;
    mrcOptions.loaders = mrcOptions.loaders || {};
    mrcOptions.plugins = mrcOptions.plugins || {};
    const defaultWebpackOptions = {
        mode: isDev ? 'development' : 'production',
        entry: './src/app.tsx',
        output: {
            path: path.resolve(workDir, 'build'),
            publicPath: '/',
            filename: '[name].js',
            chunkFilename: '[name].chunk.js'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
              '@': path.resolve(workDir, 'src'),
              pages: path.resolve(workDir, 'src/pages'),
            },
        },
        resolveLoader: {
            modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules'],
        },
        module: {
            rules: loadLoaders(mrcOptions),
        },
        plugins: loadPlugins(mrcOptions, noHash),
    };

    if(!noHash){
        defaultWebpackOptions.output.filename = '[name].[hash:10].js';
        defaultWebpackOptions.output.chunkFilename = '[name].[hash:10].chunk.js';
    }

    if(process.env.PUBLIC_URL){
        defaultWebpackOptions.output.publicPath = process.env.PUBLIC_URL;
    }
    return merge(defaultWebpackOptions, mrcOptions.webpackOptions || {});
}