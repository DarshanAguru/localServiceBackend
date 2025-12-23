import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest', // or a specific year like 2022
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
      },
    },
    rules: {
      eqeqeq: 'warn',
      'no-unused-vars': 'warn',
      'no-constant-condition': 'error',
      curly: 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-redeclare': 'error',
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'handle-callback-err': 'error',
      'no-path-concat': 'error',
    },
  },
  prettier,
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**'],
  },
];
