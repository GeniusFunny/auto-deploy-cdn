const { spawnSync } = require('child_process')
const colors = require('colors')
/**
 * 拉取svn上的资源
 */
function svnCoResource(remote, tempDir) {
  const svn_checkout = spawnSync('svn', ['checkout', remote], {
    cwd: tempDir,
    encoding: 'utf8'
  })
  const { status, output } = svn_checkout
  if (status !== 0) {
    throw new Error(output.join('').red)
  } else {
    console.log(output.join('').green)
  }
}

module.exports = svnCoResource

/**
 * @param project
 * @param commitMessage
 * @param tempDir
 */
function svnUpdateRemote(project, commitMessage, tempDir) {
  try {
    svnAddOrUpdate(project, tempDir)
  } catch (e) {
    console.log('执行svn add/update 失败'.red)
    throw e
  }
  try {
    svnCommit(project, commitMessage, tempDir)
  } catch (e) {
    console.log('执行svn commit 错误'.red)
    throw e
  }
}

/**
 *
 * @param project
 * @param tempDir
 */
function svnAddOrUpdate(project, tempDir) {
  const projectPath = `${tempDir}/${project}`
  const add = spawnSync('svn', ['add', '.', '--no-ignore', '--force'], {
    cwd: projectPath,
    encoding: 'utf8'
  })
  let { status, output } = add
  if (status !== 0) {
    throw new Error(output.join(''))
    // const update = spawnSync('svn', ['update', '.'], {
    //   cwd: projectPath,
    //   encoding: 'utf8'
    // })
    // let { status, output } = update
    // if (status !== 0) {
    //   throw new Error(output.join(''))
    // } else {
    //   console.log(output.join(''))
    // }
  } else {
    console.log(output.join(''))
  }
}

function svnCommit(project, commitMessage, tempDir) {
  const projectPath = `${tempDir}/${project}`
  const svn_commit = spawnSync('svn', ['commit', '-m', commitMessage], {
    cwd: projectPath,
    encoding: 'utf8'
  })
  const { status, output } = svn_commit
  if (status !== 0) {
    throw new Error(output.join(''))
  } else {
    console.log(output.join(''))
  }
}

module.exports = {
  svnCoResource,
  svnUpdateRemote,
  svnCommit,
  svnAddOrUpdate,
}
