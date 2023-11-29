import './commands';

import { mount } from 'cypress/react';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      loadApp(): void;
      loadGraph(name: string): void;
      loadAppWithoutGraph(): void;
      saveWorkflow(name: string): void;
      openNewWorkflow(): void;
      deleteWorkflow(name: string): void;
      dragNodeInCanvas(task_identifier: string): void;
      hasNavBarLabel(label: string): void;
      hasVisibleNodes(expectedNumberOfNodes: number): void;
      hasVisibleEdges(expectedNumberOfEdges: number): void;
    }
  }
}

Cypress.Commands.add('mount', mount);
