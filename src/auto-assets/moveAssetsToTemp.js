const { spawnSync } = require('child_process')
const { readdirSync } = require('fs')
/**
 * webpack构建完成后，将build目录下的asserts的文件移入临时目录temp中
 *
 */
function moveAssetsToTemp(project) {
  const resourcePath = `${process.cwd()}/build/assets`
  const targetPath = `${process.cwd()}/temp/${project}`
  // 暂时为复制，理应为移动
  const resource = readdirSync(resourcePath)
  resource.map(file => `${resourcePath}/${file}`).forEach(file => {
    const moveFiles = spawnSync('cp', [ '-r', file, targetPath])
    const { stderr, stdout } = moveFiles
    if (stderr && stderr.length) {
      throw new Error(`移动${file}到临时目录失败`)
    } else {
      console.log(stdout.toString())
    }
  })
}

module.exports = moveAssetsToTemp
