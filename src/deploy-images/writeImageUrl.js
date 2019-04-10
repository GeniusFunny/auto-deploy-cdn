const eventEmitter = require('./eventEmitter')
const { createWriteStream } = require('fs')

function generateJS(imageUrls) {
  const declareString = imageUrls.reduce((prev, current) => prev + `const ${current.name} = '${current.value}'\n`, '')
  const exportString = imageUrls.reduce((prev, current, idx) => {
    if (idx === imageUrls.length -1) {
      return prev + `  ${current.name}\n`
    }
    return prev + `  ${current.name},\n`
  }, '\nexport {\n') + '}'
  return declareString + exportString
}

function writeImageUrl(imageUrls, imagePath) {
  const writeStream = createWriteStream(imagePath)
  writeStream.write(generateJS(imageUrls), (err) => {
    if (err) throw err
    eventEmitter.emit('writeSuccess')
  })
}

module.exports = writeImageUrl
