const svnCoResource = require('./svnCoResource')
const svnOps = require('./svnOps')
const gitOps = require('./gitOps')
const { deleteFileAndDirectory, mkdir, moveFiles } = require('./utils')

function autoAssets(svnRemote) {
  const cwd = process.cwd()
  const tempDir = `${cwd}/temp`
  const buildDir = `${cwd}/build`
  const distDir = `${cwd}/dist`
  try {
    mkdir(tempDir)
  } catch (e) {
    console.log('创建临时目录失败', e)
    throw e
  }
  try {
    svnCoResource(svnRemote, tempDir)
  } catch (e) {
    console.log('svn checkout 失败', e)
    throw e
  }
  try {
    moveFiles(`${buildDir}/assets`, `${tempDir}/yoj`)
  } catch (e) {
    console.log('移动静态资源到临时目录失败', e)
  }
  try {
    svnOps('yoj', '测试')
  } catch (e) {
    console.log('svn 更新失败', e)
  }
  try {
    deleteFileAndDirectory(tempDir)
  } catch (e) {
    console.log('删除临时目录失败', e)
  }
  try {
    mkdir(distDir)
  } catch (e) {
    console.log('创建dist目录失败', e)
  }
  try {
    moveFiles(buildDir, distDir)
  } catch (e) {
    console.log('移动剩余资源到dist失败', e)
  }
  try {
    deleteFileAndDirectory(buildDir)
  } catch (e) {
    console.log('删除build文件夹失败', e)
  }
  try {
    gitOps('连环测试')
  } catch (e) {
    console.log('更新git仓库失败', e)
  }
}

module.exports = autoAssets
