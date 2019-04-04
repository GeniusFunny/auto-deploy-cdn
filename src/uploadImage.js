const fs = require('fs')
const path = require('path')
// const queryString = require('querystring')
const http = require('http')
const buildPath = path.resolve(__dirname, '../build/assets')
const assetsToUpload = []
const options = {
  hostname: 'oimagea1.ydstatic.com',
  path: '/upload?method=uploadImage&product=xue&tourl=',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data;',
  }
}
function resolve_dir(dir) {
  try {
    const files = fs.readdirSync(dir)
    files.map(file => `${dir}/${file}`).forEach(file => {
      const stats = fs.statSync(file)
      if (stats.isFile()) {
        assetsToUpload.push(file)
      } else if (stats.isDirectory()) {
        resolve_dir(file)
      }
    })
  } catch (e) {
    throw new Error(e)
  }
}

function uploadFile(file) {
  const req = http.request({
    ...options,
    formData: fs.createReadStream(file)
  }, res => {
    console.log('STATUS: ' + res.statusCode)
    res.setEncoding('utf8')
    // console.log(res.getHeader('location'))
  })
  req.on('error', err => {
    console.log(err)
  })
  req.end()
}

resolve_dir(buildPath)
assetsToUpload.forEach(item => {
  uploadFile(item)
})

