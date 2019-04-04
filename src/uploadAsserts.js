const { spawnSync } = require('child_process')

const git_add = spawnSync('git', ['add', '.'])
console.log(git_add.stderr.toString())
const git_commit = spawnSync('git', ['commit', '-m', `'test'`])
// const git_push = spawnSync('git', ['push', '-u', 'origin', 'master'])
