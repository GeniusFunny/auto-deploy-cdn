const autoAssets = require('./src/auto-assets')
autoAssets({
  svnCommitMessage: '测试',
  svnProjectName: 'yoj',
  svnRemote: 'https://corp.youdao.com/svn/ydstatic/ke/yoj/',
  autoGit: true,
  gitCommitMessage: '脚本貌似写好了，但是有很多优化的点',
  gitBranch: 'master',
  ldap: 'yanghang',
  password: 'GeniusFunny1998',
  svnDir: 'ke'
})
