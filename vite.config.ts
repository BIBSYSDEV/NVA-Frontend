import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

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
  plugins: [react(), eslint()],
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
      onwarn: ({ message }) => {
        console.warn(message); // eslint-disable-line no-console
        if (message.startsWith('[plugin vite-plugin-eslint]')) {
          throw new Error(message);
        }
      },
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
});
