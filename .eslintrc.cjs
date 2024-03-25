module.exports = {
  env: { node: true, browser: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint', '@tanstack/query'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/jsx-key': 'off', // TODO: Violations of this rule should be resolved, so we can implement this rule
    'react/no-children-prop': 'off', // TODO: Violations of this rule should be resolved, so we can implement this rule
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
};
