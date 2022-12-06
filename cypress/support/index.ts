import './commands';

import { mount } from 'cypress/react';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      loadApp(): void;
      loadAppWithoutGraph(): void;
    }
  }
}

Cypress.Commands.add('mount', mount);
