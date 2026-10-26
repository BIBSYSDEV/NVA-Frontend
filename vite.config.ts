// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest/config" />
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
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

const sourceFilesGlob = 'src/**/*.{ts,tsx}';
const testFilesGlob = 'src/**/*.test.{ts,tsx}';
const browserTestFilesGlob = 'src/**/*.browser.test.{ts,tsx}';

export default defineConfig({
  plugins: [
    babel({ presets: [reactCompilerPreset()] }),
    react(),
    // NOTE: Skip type and lint checks in Vitest, since the checker's error overlay would interfere with browser tests
    !process.env.VITEST &&
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
    rolldownOptions: {
      output: {
        manualChunks: (id) => {
          if (largeLibraries.some((library) => id.includes(`node_modules/${library}`))) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov', 'json-summary'],
      include: [sourceFilesGlob],
      exclude: [testFilesGlob, 'src/**/*.d.ts', 'src/types/**', 'src/utils/testfiles/**', 'src/index.tsx'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts'],
          exclude: [...configDefaults.exclude, 'cypress/**', browserTestFilesGlob],
        },
      },
      {
        extends: true,
        optimizeDeps: {
          // NOTE: Pre-bundle every dependency up front. Otherwise Vite discovers new dependencies in lazy routes
          // mid-run and reloads the test page, which fails the test. This happens on every cold cache, like in CI.
          entries: [sourceFilesGlob, `!${testFilesGlob}`],
          // NOTE: Only imported by test files, which the entries above leave out
          include: ['vitest-browser-react'],
        },
        test: {
          name: 'browser',
          include: [browserTestFilesGlob],
          setupFiles: ['src/utils/testfiles/browserSetup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: { width: 1600, height: 900 },
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
