import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin } from 'vite';

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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              console.log(id);
              if (id.includes('icon')) {
                return '@mui-icons';
              } else {
                return '@mui';
              }
            } else if (id.includes('@uppy')) {
              return '@uppy';
            } else if (id.includes('react-dom')) {
              return 'react-dom';
            }
          }
        },
      },
    },
  },
});
