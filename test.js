const autoCDN = require('./src/index')


autoCDN({
  svnRemote:'https://corp.youdao.com/svn/ydstatic/ke/yoj/',
  gitBranch: 'master',
  commitMessage: '继续测试！！！'
})
