const path = require('path')

module.exports = {
  testRegex: '(test|spec)\\.[jt]sx?$',
  moduleNameMapper: {
    '@/(.*)': path.resolve(__dirname, 'src') + '/$1'
  }
}
