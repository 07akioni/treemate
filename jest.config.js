module.exports = {
  testRegex: '(test|spec)\\.[jt]sx?$',
  moduleNameMapper: {
    "@/(.*)": require('path').resolve(__dirname, 'src') + '/$1',
  }
}