import eslintPluginTanstackQuery from '@tanstack/eslint-plugin-query';
import eslintPluginTypeScript from '@typescript-eslint/eslint-plugin';
import eslintParserTypeScript from '@typescript-eslint/parser';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

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
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintPluginTypeScript.configs.recommended.rules,
      ...eslintPluginTanstackQuery.configs.recommended.rules,
      ...eslintPluginJsxA11y.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
      'no-console': 'warn',
      'no-debugger': 'warn',
    },
  },
  reactHooks.configs['recommended-latest'],
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
];
