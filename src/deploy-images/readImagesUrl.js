const eventEmitter = require('./eventEmitter')

function readImagesUrl(path) {
  import(path).then(images => {
    eventEmitter.emit('read', images)
  })
}

module.exports = readImagesUrl
