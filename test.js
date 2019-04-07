// autoCDN({
//   svnRemote:'https://corp.youdao.com/svn/ydstatic/ke/yoj/',
//   gitBranch: 'master',
//   commitMessage: '继续测试！！！'
// })
const autoAssets = require('./src/auto-assets')
autoAssets('https://corp.youdao.com/svn/ydstatic/ke/yoj/')
