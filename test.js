const deployAssets = require('./src/deploy-css-js')
/*
  示例
*/
deployAssets({
  svnDir: '',
  svnProjectName: '',
  svnRemote: '',
  autoGit: false,
  autoRefresh: true,
  refreshPath: '',
  refreshHost: '',
  distDir: 'dist',
  buildDir: 'build',
  assetsDir: 'build/assets',
  includes: ['css', 'js']
})
