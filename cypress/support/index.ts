import './commands';

import { mount } from 'cypress/react';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      loadApp(): void;
      loadGraph(name: string): void;
      loadAppWithoutGraph(): void;
      dragNodeInCanvas(task_identifier: string): void;
    }
  }
}

Cypress.Commands.add('mount', mount);
