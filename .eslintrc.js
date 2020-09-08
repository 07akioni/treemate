module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint'
      ],
      extends: [
        'standard-with-typescript'
      ],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 0
      }
    },
    {
      files: ['*.js'],
      extends: 'standard',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    }
  ]
}
