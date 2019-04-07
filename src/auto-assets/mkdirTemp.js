const { mkdirSync, rmdirSync, accessSync, constants } = require('fs')
/**
 * 创建一个临时目录temp，作为此次更新CDN资源的svn操作目录
 */
function mkdirTemp() {
  const temp = `${process.cwd()}/temp`
  try {
    accessSync(temp, constants.F_OK)
    rmdirSync(temp)
  } catch (e) {
    // console.log('目录temp不存在')
  } finally {
    try {
      mkdirSync(temp)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = mkdirTemp
