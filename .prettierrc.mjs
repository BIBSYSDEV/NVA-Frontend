export default {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 120,
  bracketSameLine: true,
  endOfLine: 'auto',
  overrides: [
    {
      files: '**/*.svg',
      options: { parser: 'html' },
    },
  ],
};
