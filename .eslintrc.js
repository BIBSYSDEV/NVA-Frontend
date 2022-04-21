module.exports = {
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'react-app', // Create React App base settings
    'eslint:recommended', // recommended ESLint rules
    'plugin:cypress/recommended', // avoid showing cypress variables as error
    'plugin:@typescript-eslint/recommended', // recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display Prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    'prettier/prettier': 2,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
  },
};
