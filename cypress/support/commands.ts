import '@testing-library/cypress/add-commands';
import { registerCommand as addWaitForStableDomCommand } from 'cypress-wait-for-stable-dom';

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add('loadAppWithoutGraph', () => {
  cy.visit('http://localhost:3000/edit-workflows');
});

Cypress.Commands.add('loadGraph', (name: string) => {
  cy.findByRole('textbox', {
    name: 'Quick open',
  }).type(name);

  cy.findByRole('option', { name }).click();
  cy.waitForStableDOM();
});

Cypress.Commands.add('loadApp', () => {
  cy.loadAppWithoutGraph();
  cy.loadGraph('tutorial_Graph');
});

addWaitForStableDomCommand({ pollInterval: 300, timeout: 1000 });
