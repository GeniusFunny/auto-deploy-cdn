const { spawnSync } = require('child_process')
/**
 *
 * @param commitMessage
 * @param branch
 * 执行git操作
 */
function gitOps(commitMessage, branch) {
  console.log('开始上传文件到git')
  try {
    gitAdd()
  } catch (e) {
    console.log('git add 操作失败')
    throw e
  }
  try {
    gitCommit(commitMessage)
  } catch (e) {
    console.log('git commit 操作失败')
    throw e
  }
  try {
    gitPush(branch)
  } catch (e) {
    console.log('git push 操作失败')
    throw e
  }
}
function gitAdd() {
  const git_add = spawnSync('git', ['add', '.'], {
    cwd: process.cwd(),
    encoding: 'utf8'
  })
  const { status, output } = git_add
  if (status !== 0) {
    throw new Error(output.join(''))
  }
}
function gitCommit(commitMessage = Math.floor(Math.random() * Date.now())) {
  console.log('执行git commit')
  const git_commit = spawnSync('git', ['commit', '-m', commitMessage], {
    cwd: process.cwd(),
    encoding: 'utf8'
  })
  const { output, status } = git_commit
  if (status !== 0) {
    throw new Error(output.join(''))
  } else {
    console.log(output.join(''))
  }
}

function gitPush(branch = 'master') {
  const git_push = spawnSync('git', ['push', '-u', 'origin', branch], {
    cwd: process.cwd()
  })
  const { output, status } = git_push
  if (status !== 0) {
    throw new Error(output.join(''))
  } else {
    console.log(output.join(''))
  }
}

module.exports = gitOps


