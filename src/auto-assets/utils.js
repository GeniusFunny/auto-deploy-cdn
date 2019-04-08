const { unlinkSync, readdirSync, mkdirSync, rmdirSync, accessSync, constants, statSync } = require('fs')
const { spawnSync } = require('child_process')

/**
 *
 * @param sourcePath
 * @param targetPath
 */
function moveFiles(sourcePath, targetPath) {
  const moveFiles = spawnSync('cp', ['-r', sourcePath, targetPath], {
    encoding: 'utf8'
  })
  const { status, output} = moveFiles
  if (status !== 0) {
    throw new Error(output.join(''))
  }
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
  } catch (e) {
    throw e
  }
}
function getStats(dir) {
  try {
    return statSync(dir)
  } catch (e) {
    throw e
  }
}
function deleteDir(dir) {
  const files = readdirSync(dir)
  if (!files.length) {
    try {
      rmdirSync(dir)
    } catch (e) {
      throw e
    }
  } else {
    files.map(item => `${dir}/${item}`).forEach(item => deleteFileAndDirectory(item))
    try {
      rmdirSync(dir)
    } catch (e) {
      throw e
    }
  }
}
function isCorrectType(name,value, type) {
  if (type === 'array') {
    if (!Array.isArray(value)) {
      throw new Error(`${name} must be a array`)
    }
  } else {
    if (typeof value !== type) {
      throw new Error(`${name} must be a ${type}`)
    }
  }
}
module.exports = {
  deleteFileAndDirectory,
  mkdir,
  moveFiles,
  isCorrectType
}
