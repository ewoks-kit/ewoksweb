import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    supportFile: 'cypress/support/index.ts',
  },

  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },

  fixturesFolder: false,
  screenshotOnRunFailure: false,
  video: false,
  defaultCommandTimeout: 10_000,
});
