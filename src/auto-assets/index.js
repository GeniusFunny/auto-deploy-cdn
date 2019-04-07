const { svnCoResource, svnUpdateRemote } = require('./svnOps')
const gitOps = require('./gitOps')
const { handleError1, handleError2 } = require('./handleError')
const { deleteFileAndDirectory, mkdir, moveFiles } = require('./utils')
const { tempDir, buildDir, distDir} = require('./config')

function autoAssets(svnRemote) {
  try {
    mkdir(tempDir)
  } catch (e) {
    console.log('创建临时目录失败', e)
    throw e
  }
  try {
    svnCoResource(svnRemote)
  } catch (e) {
    console.log('svn checkout 失败', e)
    handleError1()
    throw e
  }
  try {
    moveFiles(`${buildDir}/assets`, `${tempDir}/yoj`)
  } catch (e) {
    console.log('移动静态资源到临时目录失败', e)
    handleError1()
    throw e
  }
  try {
    svnUpdateRemote('yoj', '测试')
  } catch (e) {
    console.log('svn 更新失败', e)
    handleError1()
    throw e
  }
  try {
    deleteFileAndDirectory(tempDir)
  } catch (e) {
    console.log('删除临时目录失败', e)
    handleError1()
    throw e
  }
  console.log('资源已部署到CDN')
  try {
    mkdir(distDir)
  } catch (e) {
    console.log('创建dist目录失败', e)
    throw e
  }
  try {
    moveFiles(buildDir, distDir)
  } catch (e) {
    console.log('移动剩余资源到dist失败', e)
    handleError2()
    throw e
  }
  try {
    deleteFileAndDirectory(buildDir)
  } catch (e) {
    console.log('删除build文件夹失败', e)
    handleError2()
    throw e
  }
  try {
    deleteFileAndDirectory(`${distDir}/assets`)
    gitOps('连环测试')
  } catch (e) {
    console.log('更新git仓库失败', e)
    handleError2()
    throw e
  }
}

module.exports = autoAssets
