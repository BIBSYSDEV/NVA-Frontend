import { defineConfig } from 'cypress';
import cypressPlugin from './cypress/plugins/index.js';

export default defineConfig({
  projectId: '1rrqbw',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      return cypressPlugin(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
