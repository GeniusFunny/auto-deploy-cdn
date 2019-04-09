const http = require('http')
const colors = require('colors')
const readlineSync = require('readline-sync')
const queryString = require('querystring')
/**
 * 资源部署到CDN后，需要手动使其生效
 */
function refreshCDN(svnDir = 'ke', svnCommitMessage = '') {
  const username = readlineSync.question('username: ')
  const password = readlineSync.question('password: ')
  const postData = queryString.stringify({
    request_log: svnDir,
    request_submit: svnCommitMessage
  })
  const options = {
    host: 'corp.youdao.com',
    method: 'POST',
    path: '/IT/updateshared/',
    auth: `${username}:${password}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  }
  const req = http.request(options, res => {
    if (res.statusCode === 302) {
      console.log('部署资源已触发更新，5分钟后生效，请勿过早上线'.yellow)
    } else {
      throw new Error('触发更新失败, 请检查用户名与密码是否正确'.red)
    }
  })
  req.on('error', e =>{
    console.log(e)
  })
  req.write(postData)
  req.end()
}

module.exports = refreshCDN
