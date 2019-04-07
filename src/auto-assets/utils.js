const { unlinkSync, readdirSync, mkdirSync, rmdirSync, accessSync, constants } = require('fs')
const { spawnSync } = require('child_process')

/**
 * 移动文件
 */
function moveFiles(sourcePath, targetPath) {
  const resource = readdirSync(sourcePath)
  resource.map(file => `${sourcePath}/${file}`).forEach(file => {
    const moveFiles = spawnSync('cp', ['-r', file, targetPath], {
      encoding: 'utf8'
    })
    const { status, output} = moveFiles
    if (status !== 0) {
      throw new Error(output.join(''))
    }
  })
}
/**
 * 创建目录
 */
function mkdir(dir) {
  try {
    accessSync(dir, constants.F_OK)
    deleteFileAndDirectory(dir)
  } catch (e) {

  } finally {
    try {
      mkdirSync(dir)
    } catch (e) {
      console.log(e)
    }
  }
}
/**
 * 递归删除文件夹/文件
 */
function deleteFileAndDirectory(dir) {
  let stats = getStats(dir)
  if (stats.isFile()) {
    deleteFile(dir)
  } else if (stats.isDirectory()) {
    deleteDir(dir)
  }
}

function deleteFile(file) {
  try {
    unlinkSync(file)
    console.log('删除文件' + file)
  } catch (error) {
    console.log(error)
    throw error
  }
}
function getStats(dir) {
  try {
    return statSync(dir)
  } catch (error) {
    console.log(error)
    throw error
  }
}
function deleteDir(dir) {
  const files = readdirSync(dir)
  if (!files.length) {
    try {
      rmdirSync(dir)
      console.log('删除目录' + dir)
    } catch (error) {
      console.log(error)
      throw error
    }
  } else {
    files.map(item => `${dir}/${item}`).forEach(item => deleteFileAndDirectory(item))
    try {
      rmdirSync(dir)
      console.log('删除目录' + dir)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
module.exports = {
  deleteFileAndDirectory,
  mkdir,
  moveFiles
}
