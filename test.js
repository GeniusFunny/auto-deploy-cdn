const autoAssets = require('./src/deploy-css-js')
/*
  示例
*/
autoAssets({
  svnDir: 'xx',
  svnProjectName: 'xxx',
  svnRemote: 'xxxx',
  autoGit: false,
  autoRefresh: false,
  refreshPath: '',
  refreshHost: '',
  distDir: 'dist',
  buildDir: 'build',
  assetsDir: 'build/assets',
  includes: ['css', 'js']
})
