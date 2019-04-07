const { spawnSync } = require('child_process')

/**
 * 拉取svn上的资源
 */
function svnCoResource(remote, dir) {
  const svn_checkout = spawnSync('svn', ['checkout', remote], {
    cwd: dir,
    encoding: 'utf8'
  })
  const { status, output } = svn_checkout
  if (status !== 0) {
    throw new Error(output.join(''))
  } else {
    console.log(output.join(''))
  }
}

module.exports = svnCoResource
