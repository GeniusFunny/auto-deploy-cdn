const { spawn } = require('child_process')

const git_add = spawn('git', ['add', '.'])

git_add.stdout.on('data', (data) => {
  console.log('???')
  const git_commit = spawn('git', ['commit', '-m', `'test'`])
  git_commit.stdout.on('data', data => {
    const git_push = spawn('git', ['push', '-u', 'origin', 'master'])
    git_push.stdout.on('data', data => {
      console.log(data)
    })
    git_push.stderr.on('data', err => {
      console.log(err)
    })
    git_push.on('close', info => {
      console.log('git push close')
    })
  })
  git_commit.stderr.on('data', err => {
    console.log(err)
  })
  git_commit.on('close', info => {
    console.log('git commit close')
  })
})
git_add.stderr.on('data', err => {
  console.log(err)
})
git_add.on('close', info => {
  console.log('git add close', info)
})

