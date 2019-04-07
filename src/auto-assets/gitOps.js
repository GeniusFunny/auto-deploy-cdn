const { spawnSync } = require('child_process')

/**
 *
 * @param commitMessage
 * @param branch
 * 执行git操作
 */
function gitOps(commitMessage, branch) {
  console.log('开始上传文件到git')
  gitAdd()
  gitCommit(commitMessage)
  try {
    // gitPush(branch)
  } catch (e) {
    console.log(e)
    throw new Error('执行git push 错误')
  }
}
function gitAdd() {
  console.log('执行git add')
  const git_add = spawnSync('git', ['add', '.'], {
    cwd: process.cwd()
  })
  if (git_add.stderr && git_add.stderr.length) {
    throw Error(git_add.stderr.toString())
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
  console.log(git_push)
}

module.exports = gitOps


