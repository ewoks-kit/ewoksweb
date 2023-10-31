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
  cy.visit('http://localhost:3000');
  cy.findByRole('navigation').within(() =>
    cy.findByRole('link', { name: 'Edit' }).click(),
  );
  cy.waitForStableDOM();
});

Cypress.Commands.add('loadGraph', (name: string) => {
  cy.findByRole('combobox', {
    name: 'Quick open',
  }).type(name);

  cy.findByRole('option', { name }).click();
  cy.waitForStableDOM();
});

Cypress.Commands.add('loadApp', () => {
  cy.loadAppWithoutGraph();
  cy.loadGraph('tutorial_Graph');
});

Cypress.Commands.add('dragNodeInCanvas', (task_identifier: string) => {
  const dataTransfer = new DataTransfer();

  cy.findByRole('button', {
    name: task_identifier,
  }).trigger('dragstart', {
    dataTransfer,
  });

  cy.get('.react-flow').trigger('drop', {
    dataTransfer,
  });
});

Cypress.Commands.add('hasNavBarLabel', (label: string) => {
  cy.findByLabelText('Workflow title').within(() => {
    cy.contains(label).should('be.visible');
  });
});

Cypress.Commands.add('hasVisibleNodes', (expectedNumberOfNodes: number) => {
  cy.findAllByTestId(/^rf__node/)
    .should('have.length', expectedNumberOfNodes)
    .should('be.visible');
});

Cypress.Commands.add('hasVisibleEdges', (expectedNumberOfEdges: number) => {
  cy.findAllByTestId(/^rf__edge/)
    .should('have.length', expectedNumberOfEdges)
    .should('be.visible');
});

addWaitForStableDomCommand({ pollInterval: 300, timeout: 5000 });
