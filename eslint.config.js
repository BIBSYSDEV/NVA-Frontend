import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import eslintParserTypeScript from '@typescript-eslint/parser';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: eslintParserTypeScript,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypeScript,
      '@tanstack/query': eslintPluginTanstackQuery,
      'jsx-a11y': eslintPluginJsxA11y,
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      ...eslintPluginTypeScript.configs.recommended.rules,
      ...eslintPluginTanstackQuery.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReact.configs['jsx-runtime'].rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
];

// export default [
//   //   eslintPluginReact.configs.recommended,
//   //   eslintPluginReactHooks.configs.recommended,
//   //   eslintPluginTypeScript.configs.recommended,
//   eslintPluginReact.configs.flat.recommended,
//   eslintPluginReact.configs.flat['jsx-runtime'],
//   ...eslintPluginTanstackQuery.configs['flat/recommended'],
//   eslintPluginJsxA11y.flatConfigs.recommended,

//   {
//     files: ['**/*.{ts,tsx}'],
//     languageOptions: {
//       parser: eslintParserTypeScript,
//     },
//     plugins: {
//       // react: eslintPluginReact,
//       'react-hooks': eslintPluginReactHooks,
//       '@typescript-eslint': eslintPluginTypeScript,
//     },
//     rules: {
//       ...eslintPluginReactHooks.configs.recommended.rules,
//       // ...eslintPluginTypeScript.configs.rules,
//       // ...eslintPluginReact.configs.recommended.rules,
//       '@typescript-eslint/no-explicit-any': 'off',
//       '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
//       'no-console': 'warn',
//       'no-debugger': 'warn',
//     },
//   },
// ];
