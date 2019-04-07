const mkdirTemp = require('./mkdirTemp')
const svnCoResource = require('./svnCoResource')
const moveAssetsToTemp = require('./moveAssetsToTemp')
const svnOps = require('./svnOps')
const deleteTemp = require('./deleteTemp')
const { mkdirDist, moveOthersFileToDist } = require('./moveOthersFileToDist')
const gitOps = require('./gitOps')

function autoAssets(svnRemote) {
  const tempDir = `${process.cwd()}/temp`
  const buildDir = `${process.cwd()}/build`
  // mkdirTemp()
  // svnCoResource(svnRemote)
  // moveAssetsToTemp('yoj')
  // svnOps('yoj', '测试')
  // deleteTemp(tempDir)
  // mkdirDist()
  // moveOthersFileToDist()
  // deleteTemp(buildDir)
  gitOps('测试！！！')
}

module.exports = autoAssets
