const { operations, templates } = require('../src/index')

templates.deploy_images({
  uploadOptions: {
    host: 'oimagea1.ydstatic.com',
    path: '/upload?method=uploadImage&product=xue&tourl=',
    method: 'POST'
  },
  sourcePath: 'test/constants/images.js',
  successCode: 302
})

templates.deploy_css_js({
  svnDir: 'ke',
  svnProjectName: 'yoj',
  svnRemote: 'https://xxx.yyy.com/svn/ydstatic/ke/yoj/',
  autoGit: false,
  autoRefresh: true,
  distDir: 'v-1.2',
  buildDir: 'build',
  assetsDir: 'build/assets',
  includes: ['css', 'js'],
  refreshHost: 'xxx.yyy.com',
  refreshPath: '/IT/updateshared/',
})
