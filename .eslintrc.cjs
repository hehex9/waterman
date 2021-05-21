module.exports = {
  extends: '@youjinbu',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['node_modules', 'lib'],
  rules: {
    'import/extensions': ['error', 'always'],
  },
}
