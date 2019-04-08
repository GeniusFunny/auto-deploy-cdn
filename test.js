const autoAssets = require('./src/auto-assets')
autoAssets({
  svnDir: 'ke',
  svnProjectName: 'yoj',
  svnRemote: 'https://corp.youdao.com/svn/ydstatic/ke/yoj/',
  autoGit: true,
  autoRefresh: false
})
