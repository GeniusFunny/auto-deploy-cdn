const { unlinkSync, rmdirSync, readdirSync, statSync } = require('fs')

/**
 * 资源部署CDN完成，删除临时目录(递归删除)
 */
function deleteTemp(dir) {
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
    stats = statSync(dir)
    return stats
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
    files.map(item => `${dir}/${item}`).forEach(item => deleteTemp(item))
    try {
      rmdirSync(dir)
      console.log('删除目录' + dir)
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
module.exports = deleteTemp