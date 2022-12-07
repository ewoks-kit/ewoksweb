import { registerCommand as addWaitForStableDomCommand } from 'cypress-wait-for-stable-dom';

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

Cypress.Commands.add('loadAppWithoutGraph', () => {
  cy.visit('http://localhost:3000/#/edit-workflows');

  cy.window().should('have.property', '__useStore__');
});

Cypress.Commands.add('loadApp', () => {
  cy.loadAppWithoutGraph();
  cy.get('[data-testid="async-autocomplete-drop"]')
    .click()
    .get('input[type=text]')
    .type('tutorial_Graph');

  cy.contains(/^tutorial_Graph$/g).click();
});

addWaitForStableDomCommand({ pollInterval: 300, timeout: 1000 });
