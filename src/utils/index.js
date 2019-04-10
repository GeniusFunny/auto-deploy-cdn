const { unlinkSync, readdirSync, mkdirSync, rmdirSync, accessSync, constants, statSync } = require('fs')
const { spawnSync } = require('child_process')
/**
 *
 * @param sourcePath
 * @param targetPath
 */
function moveFiles(sourcePath, targetPath) {
  const moveFiles = spawnSync('cp', ['-r', `${sourcePath}`, targetPath], {
    encoding: 'utf8'
  })
  const { status, output} = moveFiles
  if (status !== 0) {
    console.log(output.join(''))
    throw new Error(output.join(''))
  }
}

/**
 *
 * @param path
 * @param includes
 */
function include(path, includes) {
  let files = readdirSync(path)
  files.map(item => `${path}/${item}`).forEach(item => {
    const stats = statSync(item)
    if (stats.isFile() && !judgeFile(item, includes)) {
      unlinkSync(item)
    } else if (stats.isDirectory()) {
      include(item, includes)
    }
  })
  files = readdirSync(path)
  if (files.length === 0) {
    rmdirSync(path)
  }
}

/**
 *
 * @param filename
 * @param includes
 * @returns {boolean}
 */
function judgeFile(filename, includes) {
  const arr = filename.split('.')
  const type = arr[arr.length - 1]
  return includes.some(item => item === type)
}

/**
 *
 * @param path
 * @param includes
 */
function exclude(path, includes) {
  let files = readdirSync(path)
  files.map(item => `${path}/${item}`).forEach(item => {
    const stats = statSync(item)
    if (stats.isFile() && judgeFile(item, includes)) {
      unlinkSync(item)
    } else if (stats.isDirectory()) {
      include(item, includes)
    }
  })
  files = readdirSync(path)
  if (files.length === 0) {
    rmdirSync(path)
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
  isCorrectType,
  include,
  exclude
}
