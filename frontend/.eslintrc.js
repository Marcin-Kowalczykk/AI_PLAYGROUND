module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './frontend/tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'react', 'prettier', 'react-hooks'],
  extends: [
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'no-console': 'warn',
    'linebreak-style': ['error', 'unix'],
    'prettier/prettier': 'warn',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],
    indent: ['error', 2],
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'lf',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        printWidth: 100,
      },
    ],
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['public/config.tpl.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
  ],
}
