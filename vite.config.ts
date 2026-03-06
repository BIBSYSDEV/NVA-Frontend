// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { configDefaults } from 'vitest/config';

const largeLibraries = [
  '@mui',
  '@uppy',
  '@aws-amplify',
  'imask',
  'i18next',
  'date-fns',
  '@tanstack',
  'isbn3',
  'yup',
  'axios',
  'formik',
];

export default defineConfig({
  plugins: [
    react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
    checker({
      typescript: true,
      eslint: {
        useFlatConfig: true,
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 10_000,
        manualChunks: (id) => {
          if (largeLibraries.some((library) => id.includes(`node_modules/${library}`))) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  test: {
    exclude: [...configDefaults.exclude, 'cypress/**'],
  },
});
