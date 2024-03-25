module.exports = {
  env: { node: true, browser: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint' /*, 'prettier', '@tanstack/query'*/],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',

    // 'plugin:cypress/recommended', // avoid showing cypress variables as error
    // 'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display Prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    // 'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'react/jsx-key': 'off', // TODO: Violations of this rule should be resolved, so we can implement this rule
    'react/no-children-prop': 'off', // TODO: Violations of this rule should be resolved, so we can implement this rule
  },
  // rules: {
  //   'prettier/prettier': 2,
  // },
};
