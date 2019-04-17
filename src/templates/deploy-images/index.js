const path = require('path')
const { isCorrectType } = require('../../utils')
const readImagesUrl = require('./readImagesUrl')
const writeImageUrl = require('./writeImageUrl')
const upload = require('./upload')
const eventEmitter = require('./eventEmitter')
const { renameSync } = require('fs')

const cwd = process.cwd()

function deployImages({sourcePath, uploadOptions, successCode}) {
  try {
    isCorrectType('sourcePath', sourcePath, 'string')
    isCorrectType('uploadTargetHost', uploadOptions, 'object')
  } catch (e) {
    throw e
  }
  sourcePath = path.resolve(cwd, sourcePath)
  const sourcePathParent = sourcePath.split('/').slice(0, -1).join('/')
  const tempPath = sourcePath.replace('.js', '.mjs')
  try {
    renameSync(sourcePath, tempPath)
  } catch (e) {
    console.log('修改.js为.mjs失败')
    throw e
  }
  try {
    readImagesUrl(tempPath)
  } catch (e) {
    console.log('读取js文件中的导出变量失败')
    renameSync(tempPath, sourcePath)
    throw e
  }
  const images = []
  const results = []
  eventEmitter.on('read', (module) => {
    try {
      for (const p in module) {
        if (Object.prototype.hasOwnProperty.call(module, p)) {
          images.push({
            name: p,
            value: module[p]
          })
        }
      }
      images.forEach(item => {
        if (String.prototype.indexOf.call(item.value, 'http') !== -1) {
          results.push(item)
        } else {
          upload({ value: path.resolve(sourcePathParent, item.value), name: item.name}, uploadOptions, successCode)
        }
      })
      if (images.length === results.length) {
        renameSync(tempPath, sourcePath)
      }
    } catch (e) {
      renameSync(tempPath, sourcePath)
    }
  })
  eventEmitter.on('uploadSuccess', (item) => {
    try {
      results.push(item)
      if (results.length === images.length) {
        writeImageUrl(results, tempPath)
      }
    } catch (e) {
      renameSync(tempPath, sourcePath)
    }
  })
  eventEmitter.on('uploadFailed', (item) => {
    try {
      results.push(images[images.map(item => item.name).indexOf(item.name)])
      if (results.length === images.length) {
        writeImageUrl(results, tempPath)
      }
    } catch (e) {
      renameSync(tempPath, sourcePath)
    }
  })
  eventEmitter.on('writeSuccess', () => {
    try {
      renameSync(tempPath, sourcePath)
    } catch (e) {
      console.log('还原文件类型失败')
      renameSync(tempPath, sourcePath)
      throw e
    }
  })
}
module.exports = deployImages
