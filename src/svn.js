const { spawnSync } = require('child_process')

function svn(remote, commitMessage) {
  console.log('资源文件(js/css)上传到CDN服务器')
  try {
    svnCo(remote)
  } catch (e) {
    throw new Error('执行svn checkout 错误')
  }
  try {
    svnAdd()
  } catch (e) {
    throw new Error('执行svn add 错误')
  }
  try {
    svnCommit(commitMessage)
  } catch (e) {
    throw new Error('执行svn commit 错误')
  }
}

function svnCo(remote) {
  console.log('开始执行svn checkout')
  const svn_co = spawnSync('svn', ['co', remote])
  if (svn_co.stderr.length) {
    throw new Error(svn_co.stderr.toString())
  } else {
    console.log(svn_co.stdout.toString())
  }
}
function svnAdd() {
  console.log('开始执行svn add *')
  const svn_add = spawnSync('svn', ['add', '.'])
  if (svn_add.stderr.length) {
    throw new Error(svn_add.stderr.toString())
  } else {
    console.log(svn_add.stdout.toString())
  }
}

function svnCommit(commitMessage) {
  console.log('开始执行svn commit -m ', commitMessage)
  const svn_commit = spawnSync('svn', ['commit', '-m', commitMessage])
  if (svn_commit.stderr.length) {
    throw new Error(svn_commit.stderr.toString())
  } else {
    console.log(svn_commit.stdout.toString())
  }
}

module.exports = svn
