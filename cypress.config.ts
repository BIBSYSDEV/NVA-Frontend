import codeCoverageTask from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'kigtb6',
  video: false,
  viewportWidth: 1600,
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      on('task', {
        table(message) {
          console.table(message); // eslint-disable-line no-console
          return null;
        },
      });
      return config;
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  retries: {
    runMode: 3,
  },
});
