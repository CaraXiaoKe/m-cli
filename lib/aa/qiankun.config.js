module.exports = ({ appName }) => {
    return {
        output: {
            publicPath: process.env.NODE_ENV === 'local' ? `http://localhost:${process.env.PORT}/` : process.env.PUBLIC_URL,
            // 微前端配置 https://qiankun.umijs.org/zh/guide/getting-started#2-配置微应用的打包工具
            library: appName,
            libraryTarget: 'umd',
            jsonpFunction: `webpackJsonp_${appName}`,
        },
    }
}