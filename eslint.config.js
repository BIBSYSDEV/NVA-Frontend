import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import eslintParserTypeScript from '@typescript-eslint/parser';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  //   eslintPluginReact.configs.recommended,
  //   eslintPluginReactHooks.configs.recommended,
  //   eslintPluginJsxA11y.configs.recommended,
  //   eslintPluginTanstackQuery.configs.recommended,
  //   eslintPluginTypeScript.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: eslintParserTypeScript,
    },
    plugins: {
      react: eslintPluginReact,
      'react-hooks': eslintPluginReactHooks,
      'jsx-a11y': eslintPluginJsxA11y,
      '@tanstack/query': eslintPluginTanstackQuery,
      '@typescript-eslint': eslintPluginTypeScript,
    },
    rules: {
      //   ...eslintPluginReact.configs.rules,
      //   ...eslintPluginTypeScript.configs.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
];
