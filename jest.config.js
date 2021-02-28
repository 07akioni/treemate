const path = require('path')

module.exports = {
  testRegex: '(test|spec)\\.[jt]sx?$',
  coveragePathIgnorePatterns: ['src/__tests__'],
  moduleNameMapper: {
    '@/(.*)': path.resolve(__dirname, 'src') + '/$1'
  }
}
