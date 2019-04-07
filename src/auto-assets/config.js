const cwd = process.cwd()
const tempDir = `${cwd}/temp`
const buildDir = `${cwd}/build`
const distDir = `${cwd}/dist`

module.exports = {
  tempDir,
  buildDir,
  distDir
}
