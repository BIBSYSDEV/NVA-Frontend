module.exports = {
  env: { node: true, browser: true, es6: true },
  parser: '@typescript-eslint/parser',
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
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-key': 'off', // TODO: Violations of this rule should be resolved, so we can implement this rule
    'react/no-children-prop': 'off', // TODO: Violations of this rule should be resolved, so we can implement this rule
    'no-console': 'off',
    'no-debugger': 'warn',
  },
};
