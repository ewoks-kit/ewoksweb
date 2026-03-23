import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: { supportFile: 'cypress/support/index.ts' },
  fixturesFolder: false,
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 10_000,
});
