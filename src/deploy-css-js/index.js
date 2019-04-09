const readlineSync = require('readline-sync')
const colors = require('colors')
const { svnCoResource, svnUpdateRemote } = require('./svnOps')
const gitOps = require('./gitOps')
const { handleError1, handleError2 } = require('./handleError')
const { deleteFileAndDirectory, mkdir, moveFiles, isCorrectType, include, exclude } = require('./utils')
const { tempDir } = require('./config')
const refreshCDN = require('./refreshCDN')
/**
 *
 * @param svnRemote  svn远程仓库地址
 * @param svnProjectName svn远程仓库名字
 * @param svnDir svn二级目录
 * @param autoGit 是否自动执行Git更新操作
 * @param autoRefresh 是否自动触发CDN生效操作
 * @param buildDir 打包后的构建目录
 * @param assetsDir 静态资源目录,若未指明则为buildDir
 * @param distDir 除去静态资源的资源存放的目录
 * @param includes 需要部署到CDN的资源类型，默认['css', 'js']
 */
function autoAssets(
  {
    svnRemote,
    svnProjectName,
    autoGit = true,
    autoRefresh = true,
    includes = ['css', 'js'],
    buildDir = 'build',
    distDir = 'dist',
    assetsDir = buildDir,
    svnDir
  }
  ) {
  const cwd = process.cwd()

  isCorrectType('svnRemote', svnRemote, 'string')
  isCorrectType('svnProjectName', svnProjectName, 'string')
  isCorrectType('autoGit', autoGit, 'boolean')
  isCorrectType('autoRefresh', autoRefresh, 'boolean')
  isCorrectType('svnDir', svnDir, 'string')
  isCorrectType('includes', includes, 'array')
  isCorrectType('buildDir', buildDir, 'string')
  isCorrectType('distDir', distDir, 'string')
  isCorrectType('assetsDir', assetsDir, 'string')

  buildDir = `${cwd}/${buildDir}`
  distDir = `${cwd}/${distDir}`
  assetsDir = `${cwd}/${assetsDir}`

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
    if (assetsDir !== buildDir) {
      moveFiles(assetsDir, `${tempDir}/${svnProjectName}`)
    } else {
      moveFiles(buildDir, `${tempDir}/build`)
      include(`${tempDir}/build`, includes)
      moveFiles(`${tempDir}/build/`, `${tempDir}/${svnProjectName}`)
    }
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
    deleteFileAndDirectory(tempDir)
  } catch (e) {
    console.log('删除临时目录失败'.bgRed)
    handleError1()
    throw e
  }
  console.log('资源已部署到CDN'.green)
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
    moveFiles(`${buildDir}/`, distDir)
    if (assetsDir !== buildDir) {
      deleteFileAndDirectory(assetsDir.replace(buildDir, distDir))
    } else {
      exclude(distDir, includes)
    }
  } catch (e) {
    console.log('移动剩余资源到dist失败'.bgRed)
    handleError2(distDir)
    throw e
  }
  try {
    deleteFileAndDirectory(buildDir)
  } catch (e) {
    console.log('删除build文件夹失败'.bgRed)
    handleError2(distDir)
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
      handleError2(distDir)
      throw e
    }
  }
}

module.exports = autoAssets
