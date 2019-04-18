const { gitOps, gitAdd, gitCommit, gitPush } = require('./gitOp')
const { svnCommit, svnAddOrUpdate, svnCoResource, svnUpdateRemote}= require('./svnOp')
const refreshCDN = require('./refreshCDN')

module.exports = {
  gitOps, gitAdd, gitCommit, gitPush,
  svnAddOrUpdate, svnCommit, svnCoResource, svnUpdateRemote,
  refreshCDN
}
