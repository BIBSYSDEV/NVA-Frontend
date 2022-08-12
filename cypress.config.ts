import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  projectId: 'kigtb6',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  env: {
    key: '19c408a6-7f29-4d77-be78-f1235b39c5c4',
    CYPRESS_RECORD_KEY: '19c408a6-7f29-4d77-be78-f1235b39c5c4',
  },
});
