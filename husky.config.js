module.exports = {
  hooks: {
    'pre-commit': 'cp README.md docs/index.md && npm run lint && git add .'
  }
}
