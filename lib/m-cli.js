const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const logger = require('./utils/logger');
const getIPAdress = require('./utils/getIPAdress');
const getAvailablePort = require('./utils/getAvailablePort');

class MCli {
    constructor(webpackOptions, { workDir, isDev, port, devServer }){
        this.publicPath = webpackOptions.output&&webpackOptions.output.publicPath || '/'
        this.webpackOptions = webpackOptions;
        this.workDir = workDir;
        this.isDev = isDev;
        this.port = port || process.env.PORT || 8080;
        this.compiler = null;
        this.devServer =  webpackOptions.devServer || devServer || {};
    }
    createComplier(callback) {
        if(!this.compiler){
            try {
                this.compiler = webpack(this.webpackOptions);
                if(this.isDev){// https://www.cnblogs.com/zero7room/p/6671385.html
                    getAvailablePort(this.port, (port) => {
                        const ip = getIPAdress();
                        var app = new webpackDevServer(this.compiler, Object.assign({
                            publicPath: this.publicPath,
                            sockHost: ip,
                        }, this.devServer));
                        app.listen(port, "0.0.0.0", function (err) {
                            if (err) {
                                logger.error(err);
                            }
                        });
                        // 在编译成功之后输出信息
                        this.compiler.hooks.done.tap('WebpackDevMiddleware', (_stats) => {
                            process.nextTick(()=>{
                                logger.success(`listen at http://localhost:${port}`);
                                logger.success(`listen at http://${ip}:${port}`);
                            })
                        });
                    })
                }else{
                    this.compiler.run(callback);
                }
            } catch (error) {
                this.handleError(error);
                process.exit(2);
            }
        }
        return this.compiler;
    }
    run(){
        const callback = (error, stats) => {
            if(error){
                this.handleError(error);
            }
            if(stats.compilation.errors && stats.compilation.errors.length > 0){
                logger.error(stats.compilation.errors[0]);
                process.exit(2);
            } 
            if(stats.compilation.warnings && stats.compilation.warnings.length > 0){
                logger.warn(stats.compilation.warnings[0]);
            }   
        }
        this.createComplier(callback);
    }
    handleError(error) {
        // https://github.com/webpack/webpack/blob/master/lib/index.js#L267
        // https://github.com/webpack/webpack/blob/v4.44.2/lib/webpack.js#L90
        const ValidationError = webpack.ValidationError || webpack.WebpackOptionsValidationError;

        // In case of schema errors print and exit process
        // For webpack@4 and webpack@5
        if (error instanceof ValidationError) {
            logger.error(error.message);
        } else {
            logger.error(error);
        }
        process.exit(2);
    }
    
}

module.exports = MCli;