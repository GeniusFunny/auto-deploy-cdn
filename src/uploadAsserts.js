const { spawnSync } = require('child_process')

const git_add = spawnSync('git', ['add', '.'])
const git_commit = spawnSync('git', ['commit', '-m', `'test'`])
const git_push = spawnSync('git', ['push', '-u', 'origin', 'master'])
