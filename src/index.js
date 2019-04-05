const git = require('./git')
const svn = require('./svn')

function autoCDN({commitMessage = '???', svnRemote, gitBranch = 'master'}) {
  try {
    git(commitMessage, gitBranch)
  } catch (e) {
    throw e
  }
  try {
    svn(svnRemote, commitMessage)
  } catch (e) {
    throw e
  }
}

module.exports = autoCDN
