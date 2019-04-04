const { spawnSync } = require('child_process')

function git(commitMessage, branch) {
  console.log('开始上传文件到git')
  try {
    gitAdd()
  } catch (e) {
    throw new Error('执行git add 错误')
  }
  try {
    gitCommit(commitMessage)
  } catch (e) {
    throw new Error('执行git commit 错误')
  }
  try {
    gitPush(branch)
  } catch (e) {
    throw new Error('执行git push 错误')
  }
}
function gitAdd() {
  console.log('执行git add')
  const git_add = spawnSync('git', ['add', '.'])
  if (git_add.stderr.length) {
    throw Error(git_add.stderr.toString())
  }
}
function gitCommit(commitMessage = Math.floor(Math.random() * Date.now())) {
  console.log('执行git commit')
  const git_commit = spawnSync('git', ['commit', '-m', commitMessage])
  if (git_commit.stderr.length) {
    throw Error(git_commit.stderr.toString())
  } else if (git_commit.stdout.toString().indexOf('nothing to commit, working tree clean') !== -1) {
    throw Error('nothing to commit, working tree clean')
  }
}

function gitPush(branch = 'master') {
  const git_push = spawnSync('git', ['push', '-u', 'origin', branch])
  console.log(git_push.stdout.toString())
  console.log(git_push.stderr.toString())
  // if (git_push.stderr.length) {
  //   throw new Error(git_push.stderr.toString())
  // } else {
  //   console.log(git_push.stdout.toString())
  // }
}

module.exports = git


