
const net = require('net');
const logger = require('./logger');
 
function portInUse(port){
    return new Promise((resolve, reject) => {
        let server = net.createServer().listen(port);
        server.on('listening',function(){
            server.close();
            resolve(port);
        });
        server.on('error',function(err){
            if(err.code == 'EADDRINUSE'){
                resolve(err);
            }
        });             
    });
}
 
module.exports =  async function tryUsePort(port, portAvailableCallback){
    let res = await portInUse(port);
    if(res instanceof Error){
        logger.warn(`端口：${port}被占用\n`);
        port++;
        tryUsePort(port, portAvailableCallback);
    }else{
        portAvailableCallback(port);
    }
}
