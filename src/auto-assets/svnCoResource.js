const { spawnSync } = require('child_process')

/**
 * 拉取svn上的资源
 */
function svnCoResource(remote) {
  const temp = `${process.cwd()}/temp`
  const svn_checkout = spawnSync('svn', ['checkout', remote], {
    cwd: temp
  })
  const { stdout, stderr } = svn_checkout
  if (stderr && stderr.length) {
    console.log(stderr.toString())
    throw new Error(`svn checkout ${remote} 失败`)
  } else {
    console.log(stdout.toString())
  }
}

module.exports = svnCoResource
