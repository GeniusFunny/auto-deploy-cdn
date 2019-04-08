const readlineSync = require('readline-sync')
const colors = require('colors')
const { svnCoResource, svnUpdateRemote } = require('./svnOps')
const gitOps = require('./gitOps')
const { handleError1, handleError2 } = require('./handleError')
const { deleteFileAndDirectory, mkdir, moveFiles, isCorrectType } = require('./utils')
const { tempDir, buildDir, distDir } = require('./config')
const refreshCDN = require('./refreshCDN')

/**
 *
 * @param svnRemote  svn远程仓库地址
 * @param svnProjectName svn仓库名字
 * @param autoGit 是否自动更新git仓库
 * @param autoRefresh 是否自动触发CDN更新
 * @param svnDir svn二级目录
 */
function autoAssets(
  {
    svnRemote,
    svnProjectName,
    autoGit = true,
    autoRefresh = true,
    svnDir
  }
  ) {
  isCorrectType('svnRemote', svnRemote, 'string')
  isCorrectType('svnProject', svnProjectName, 'string')
  isCorrectType('autoGit', autoGit, 'boolean')
  isCorrectType('svnDir', svnDir, 'string')
  isCorrectType('autoRefresh', autoRefresh, 'boolean')
  let commitMessage = ''
  try {
    mkdir(tempDir)
  } catch (e) {
    console.log('创建临时目录失败'.bgRed)
    throw e
  }
  try {
    svnCoResource(svnRemote)
  } catch (e) {
    console.log('svn checkout 失败'.bgRed)
    handleError1()
    throw e
  }
  try {
    moveFiles(`${buildDir}/assets`, `${tempDir}/${svnProjectName}/assets`)
  } catch (e) {
    console.log('移动静态资源到临时目录失败'.bgRed)
    handleError1()
    throw e
  }
  try {
    commitMessage = readlineSync.question('输入本次commit信息：')
  } catch (e) {
    throw e
  }
  try {
    svnUpdateRemote(svnProjectName, commitMessage)
  } catch (e) {
    console.log('svn 更新失败'.bgRed)
    handleError1()
    throw e
  }
  try {
    // deleteFileAndDirectory(tempDir)
  } catch (e) {
    console.log('删除临时目录失败'.bgRed)
    handleError1()
    throw e
  }
  console.log('资源已部署到CDN'.bgGreen)
  if (autoRefresh) {
    try {
      refreshCDN(svnDir, commitMessage)
    } catch (e) {
      console.log('更新shared请求失败'.bgRed)
      throw e
    }
  }
  try {
    mkdir(distDir)
  } catch (e) {
    console.log('创建dist目录失败'.bgRed)
    throw e
  }
  try {
    moveFiles(buildDir, distDir)
  } catch (e) {
    console.log('移动剩余资源到dist失败'.bgRed)
    handleError2()
    throw e
  }
  try {
    // deleteFileAndDirectory(buildDir)
    // deleteFileAndDirectory(`${distDir}/assets`)
  } catch (e) {
    console.log('删除build文件夹失败'.bgRed)
    handleError2()
    throw e
  }
  if (autoGit) {
    let gitBranch
    try {
      gitBranch = readlineSync.question('输入本次提交到的Git分支：')
    } catch (e) {
      throw e
    }
    try {
      gitOps(gitBranch, commitMessage)
    } catch (e) {
      console.log('更新git仓库失败'.bgRed)
      handleError2()
      throw e
    }
  }
}

module.exports = autoAssets
