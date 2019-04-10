const http = require('http')
const FormData = require('form-data')
const fs = require('fs')
const eventEmitter = require('./eventEmitter')

function upload(host, urlPath, item) {
  const form = new FormData()
  form.append('file', fs.createReadStream(item.value))
  const options = {
    host,
    path: urlPath,
    method: 'POST',
    headers: form.getHeaders()
  }
  const req = http.request(options)
  form.pipe(req)
  req.on('response', res => {
    if (res.statusCode === 302) {
      eventEmitter.emit('uploadSuccess', { name: item.name, value: res.headers.location })
    } else {
      console.log('失败')
    }
  })
}

module.exports = upload
