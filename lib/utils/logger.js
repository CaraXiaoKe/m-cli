const { format } = require('util');
const { red, cyan, yellow, green } = require('chalk');

module.exports =  {
    error: (val) => console.error(`[m-cli] ${red(format(val))}`),
    warn: (val) => console.warn(`[m-cli] ${yellow(val)}`),
    info: (val) => console.info(`[m-cli] ${cyan(val)}`),
    success: (val) => console.log(`[m-cli] ${green(val)}`),
    log: (val) => console.log(`[m-cli] ${val}`),
    raw: (val) => console.log(val),
}
