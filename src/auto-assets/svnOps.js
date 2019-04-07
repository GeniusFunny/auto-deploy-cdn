const { spawnSync } = require('child_process')
const path = require('path')
const { readdirSync } = require('fs')

/**
 * 执行svn操作
 * @param project
 * @param commitMessage
 */
function svnOps(project, commitMessage) {

  try {
    svnAddOrUpdate(project)
  } catch (e) {
    console.log(e)
    throw new Error('执行svn add/update 失败')
  }
  try {
    svnCommit(project, commitMessage)
  } catch (e) {
    console.log(e)
    throw new Error('执行svn commit 错误')
  }
}

/**
 *
 * @param project
 * Todo: 回滚
 */
function svnAddOrUpdate(project) {
  const projectPath = `${process.cwd()}/temp/${project}`
  const projectFiles = readdirSync(projectPath)
  projectFiles.forEach(item => {
    const update = spawnSync('svn', ['add', item], {
      cwd: projectPath
    })
    let { stderr, stdout } = update
    if (stderr && stderr.length) {
      console.log(stderr.toString())
      const add = spawnSync('svn', ['update', item], {
        cwd: projectPath
      })
      stdout = add.stdout
      stderr = add.stderr
      if (stderr && stderr.length) {
        console.log(stderr.toString())
      } else {
        console.log(stdout.toString())
      }
    } else {
      console.log(stdout.toString())
    }
  })
}

function svnCommit(project, commitMessage) {
  console.log('开始执行svn commit -m ', commitMessage)
  const projectPath = `${process.cwd()}/temp/${project}`
  const svn_commit = spawnSync('svn', ['commit', '-m', commitMessage], {
    cwd: projectPath
  })
  if (svn_commit.stderr.length) {
    console.log(svn_commit.stderr.toString())
    throw new Error(svn_commit.stderr.toString())
  } else {
    console.log(svn_commit.stdout.toString())
  }
}

module.exports = svnOps
