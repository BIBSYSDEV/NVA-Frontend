import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser', // Allow building with aws-amplify: https://stackoverflow.com/a/70939057
    },
  },
});
