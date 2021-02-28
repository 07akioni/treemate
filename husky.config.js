module.exports = {
  hooks: {
    'pre-commit': 'cp docs/index.md README.md && cp docs/zh-CN.md README.zh-CN.md && npm run lint && git add .'
  }
}
