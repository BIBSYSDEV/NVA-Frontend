import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [react(), eslint(), splitVendorChunkPlugin()],
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
        if (message.startsWith('[plugin vite-plugin-eslint]')) {
          throw new Error(message);
        }
      },
    },
  },
});
