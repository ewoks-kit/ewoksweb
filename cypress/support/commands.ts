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

Cypress.Commands.add('hasBreadcrumbs', (crumbs: string[]) => {
  const linkCrumbs = crumbs.slice(0, crumbs.length - 1);
  const lastCrumb = crumbs[crumbs.length - 1];

  cy.findByLabelText('breadcrumb').within(() => {
    linkCrumbs.forEach((name) =>
      cy.findByRole('link', { name }).should('be.visible'),
    );
    cy.contains(lastCrumb).should('be.visible');
  });
});

addWaitForStableDomCommand({ pollInterval: 300, timeout: 1000 });
