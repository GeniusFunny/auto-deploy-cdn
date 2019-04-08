const { svnCoResource, svnUpdateRemote } = require('./svnOps')
const gitOps = require('./gitOps')
const { handleError1, handleError2 } = require('./handleError')
const { deleteFileAndDirectory, mkdir, moveFiles, isCorrectType } = require('./utils')
const { tempDir, buildDir, distDir} = require('./config')
const refreshCDN = require('./refreshCDN')

/**
 *
 * @param svnRemote  svn远程仓库地址
 * @param svnProjectName svn仓库名字
 * @param svnCommitMessage 本次svn提交信息
 * @param gitBranch git分支，默认master
 * @param gitCommitMessage 本次git提交信息
 * @param autoGit 是否自动更新git仓库
 * @param autoRefresh 是否自动触发CDN更新
 * @param ldap 用户名
 * @param password 密码
 * @param svnDir svn二级目录
 */
function autoAssets(
  {
    svnRemote,
    svnProjectName,
    svnCommitMessage,
    gitBranch,
    gitCommitMessage = svnCommitMessage,
    autoGit = true,
    autoRefresh = true,
    ldap,
    password,
    svnDir
  }
  ) {
  isCorrectType('svnRemote', svnRemote, 'string')
  isCorrectType('svnProject', svnRemote, 'string')
  isCorrectType('svnCommitMessage', svnCommitMessage, 'string')
  isCorrectType('gitBranch', gitBranch, 'string')
  isCorrectType('gitCommitMessage', gitCommitMessage, 'string')
  isCorrectType('autoGit', autoGit, 'boolean')
  isCorrectType('ldap', ldap, 'string')
  isCorrectType('password', password, 'string')
  isCorrectType('svnDir', svnDir, 'string')
  isCorrectType('autoRefresh', autoRefresh, 'boolean')
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
    moveFiles(`${buildDir}/assets`, `${tempDir}/${svnProjectName}`)
  } catch (e) {
    console.log('移动静态资源到临时目录失败', e)
    handleError1()
    throw e
  }
  try {
    svnUpdateRemote(svnProjectName, svnCommitMessage)
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
  if (autoRefresh) {
    try {
      refreshCDN(ldap, password, svnDir, svnCommitMessage)
    } catch (e) {
      console.log('更新shared请求失败')
      throw e
    }
  }
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
    deleteFileAndDirectory(`${distDir}/assets`)
  } catch (e) {
    console.log('删除build文件夹失败', e)
    handleError2()
    throw e
  }
  if (autoGit) {
    try {
      gitOps(gitBranch, gitCommitMessage)
    } catch (e) {
      console.log('更新git仓库失败', e)
      handleError2()
      throw e
    }
  }
}

module.exports = autoAssets
