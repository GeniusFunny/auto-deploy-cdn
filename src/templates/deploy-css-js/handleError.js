const { deleteFileAndDirectory } = require('../../utils')
const colors = require('colors')
const { tempDir } = require('./config')
function handleError1() {
  try {
    console.log('任务失败，删除创建的临时目录'.bgRed)
    deleteFileAndDirectory(tempDir)
  } catch (e) {
    console.log('删除创建的临时目录也失败了...'.bgRed)
    throw e
  }
}
function handleError2(distDir) {
  try {
    console.log('任务失败，删除创建的dist目录'.bgRed)
    deleteFileAndDirectory(distDir)
  } catch (e) {
    console.log('删除创建的dist目录也失败了...'.bgRed)
    throw e
  }
}

module.exports = {
  handleError2,
  handleError1
}
