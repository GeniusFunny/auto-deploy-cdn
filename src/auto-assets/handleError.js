const { deleteFileAndDirectory } = require('./utils')
const cwd = process.cwd()
const tempDir = `${cwd}/temp`
const distDir = `${cwd}/dist`
function handleError1() {
  try {
    console.log('任务失败，删除创建的临时目录')
    deleteFileAndDirectory(tempDir)
  } catch (e) {
    console.log('删除创建的临时目录也失败了...')
    throw e
  }
}
function handleError2() {
  try {
    console.log('任务失败，删除创建的dist目录')
    deleteFileAndDirectory(distDir)
  } catch (e) {
    console.log('删除创建的dist目录也失败了...')
    throw e
  }
}

module.exports = {
  handleError2,
  handleError1
}
