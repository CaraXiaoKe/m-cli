#! /usr/bin/env node

'use strict';
// 缓存中间产物，加快运行速度
require('v8-compile-cache');
const logger = require("./utils/logger");
const MCli = require("./m-cli");
const workDir = require("./utils/getWorkDir")();
const transferToWepackOptions = require("./config/transferToWepackOptions");
module.exports = function runCMD(){
    let isDev = process.env.NODE_ENV === 'local'; // 是否是本地开发环境
    let options = {
        workDir,
        isDev,
    };

    function isBool(value){
        return value === true || value === false;
    }

    try{
        const mrcOptions = require(`${workDir}/.mrc.js`);
        if(isBool(mrcOptions.isDev)){
            options.isDev = mrcOptions.isDev;
        }
        options = Object.assign(options, mrcOptions);
    } catch(err) {
        logger.info("项目目录下没有配置.mrc.js，按照默认配置构建");
    }

    const webpackOptions = transferToWepackOptions(options);

    const mcli = new MCli(webpackOptions, options);
    mcli.run();
}
