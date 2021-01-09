const { join, isAbsolute } = require('path');

module.exports = function(){
  let cwd = process.cwd();
  if (process.env.APP_ROOT) {
    if (!isAbsolute(process.env.APP_ROOT)) {
      return join(cwd, process.env.APP_ROOT);
    }
    return process.env.APP_ROOT;
  }
  return cwd;
};