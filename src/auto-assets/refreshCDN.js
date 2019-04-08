const http = require('http')
const queryString = require('querystring')
/**
 * 资源部署到CDN后，需要手动使其生效
 */
function refreshCDN(username, password, svnDir = 'ke', svnCommitMessage = '') {
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
    console.log('状态码:', res.statusCode)
    if (res.statusCode === 302) {
      console.log('部署资源已触发更新，5分钟后生效，请勿过早上线')
    }
  })
  req.on('error', e =>{
    console.log(e)
  })
  req.write(postData)
  req.end()
}

module.exports = refreshCDN
