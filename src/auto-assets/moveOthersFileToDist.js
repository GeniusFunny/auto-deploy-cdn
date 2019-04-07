const { mkdirSync, readdirSync } = require('fs')
const { spawnSync } = require('child_process')
/**
 * 将build下其他资源移入dist目录中
 */
function moveOthersFileToDist() {
  const resourcePath = `${process.cwd()}/build`
  const targetPath = `${process.cwd()}/dist`
  // 暂时为复制，理应为移动
  const resource = readdirSync(resourcePath)
  resource.map(file => `${resourcePath}/${file}`).forEach(file => {
    const moveFiles = spawnSync('cp', ['-r', file, targetPath])
    const { stderr, stdout } = moveFiles
    if (stderr && stderr.length) {
      throw new Error(`移动${file}到临时目录失败`)
    } else {
      console.log(stdout.toString())
    }
  })
}

function mkdirDist() {
  const dist = `${process.cwd()}/dist`
  try {
    accessSync(temp, constants.F_OK)
    rmdirSync(temp)
  } catch (e) {
    // console.log('目录dist不存在')
  } finally {
    try {
      mkdirSync(dist)
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = {
  mkdirDist,
  moveOthersFileToDist
}