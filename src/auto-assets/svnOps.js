const { spawnSync } = require('child_process')
const colors = require('colors')
const { readdirSync } = require('fs')
const { tempDir } = require('./config')
/**
 * 拉取svn上的资源
 */
function svnCoResource(remote) {
  const svn_checkout = spawnSync('svn', ['checkout', remote], {
    cwd: tempDir,
    encoding: 'utf8'
  })
  const { status, output } = svn_checkout
  if (status !== 0) {
    throw new Error(output.join('').red)
  } else {
    console.log(output.join('').blue)
  }
}

module.exports = svnCoResource

/**
 * @param project
 * @param commitMessage
 */
function svnUpdateRemote(project, commitMessage) {
  try {
    svnAddOrUpdate(project)
  } catch (e) {
    console.log('执行svn add/update 失败'.red)
    throw e
  }
  try {
    svnCommit(project, commitMessage)
  } catch (e) {
    console.log('执行svn commit 错误'.red)
    throw e
  }
}

/**
 *
 * @param project
 */
function svnAddOrUpdate(project) {
  const projectPath = `${tempDir}/${project}`
  const projectFiles = readdirSync(projectPath)
  projectFiles.forEach(item => {
    const add = spawnSync('svn', ['add', item, '--no-ignore', '--force'], {
      cwd: projectPath,
      encoding: 'utf8'
    })
    let { status, output } = add
    if (status !== 0) {
      const update = spawnSync('svn', ['update', item], {
        cwd: projectPath,
        encoding: 'utf8'
      })
      let { status, output } = update
      if (status !== 0) {
        throw new Error(output.join('').red)
      } else {
        console.log(output.join('').blue)
      }
    } else {
      console.log(output.join('').blue)
    }
  })
}

function svnCommit(project, commitMessage) {
  const projectPath = `${tempDir}/${project}`
  const svn_commit = spawnSync('svn', ['commit', '-m', commitMessage], {
    cwd: projectPath,
    encoding: 'utf8'
  })
  const { status, output } = svn_commit
  if (status !== 0) {
    throw new Error(output.join('').red)
  } else {
    console.log(output.join('').blue)
  }
}

module.exports = {
  svnCoResource,
  svnUpdateRemote
}
