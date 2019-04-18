const http = require('http')
const FormData = require('form-data')
const fs = require('fs')
const eventEmitter = require('./eventEmitter')

function upload(item, options = { host: '', path: '', method: '' }, successCode) {
  const form = new FormData()
  form.append('file', fs.createReadStream(item.value))
  options.headers = form.getHeaders()
  const req = http.request(options)
  form.pipe(req)
  req.on('response', res => {
    if (res.statusCode === successCode) {
      eventEmitter.emit('uploadSuccess', { name: item.name, value: res.headers.location })
    } else {
      console.log('上传失败')
      eventEmitter.emit('uploadFailed', { name: item.name, value: item.value })
    }
  })
}

module.exports = upload
