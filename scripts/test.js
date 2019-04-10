const deployAssets = require('../src/deploy-css-js')
const deployImages = require('../src/deploy-images')
// deployAssets({
//   svnDir: '',
//   svnProjectName: '',
//   svnRemote: '',
//   autoGit: false,
//   autoRefresh: true,
//   refreshPath: '',
//   refreshHost: '',
//   distDir: 'dist',
//   buildDir: 'build',
//   assetsDir: 'build/assets',
//   includes: ['css', 'js']
// })
deployImages({
  sourcePath: 'test/constants/images.js',
  uploadTargetHost: 'xxx.com',
  uploadTargetPath: '/upload?a=xxx&b=xxx&c=xxx'
})
