module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    indent: ['error', 2],
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
