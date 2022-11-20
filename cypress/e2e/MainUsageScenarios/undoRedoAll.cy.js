/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('links in a graph', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.get('label')
      .should('include.text', 'Open Workflow')
      .parents('.MuiAutocomplete-root')
      .click()
      .get('input[type=text]')
      .type('tutorial_Graph');

    cy.contains('tutorial_Graph').parent().click();
    cy.window().should('have.property', '__state__');
  });

  it('initially there is no back or forth', () => {
    cy.get('[data-cy="undoButton"]').click();

    cy.contains('No more back or forth!').should('be.visible');

    cy.get('[data-cy="redoButton"]').click();

    cy.contains('No more back or forth!').should('be.visible');
  });

  it('type and undo/redo sidebar label', () => {
    cy.get('.react-flow').contains('then...').parent().click();

    cy.get('[data-cy="node-edge-label"]')
      .contains('then...')
      .should('have.value', 'then...')
      .click()
      .type('Always and forever...');

    cy.get('[data-cy="saveLabelComment"]').click();

    cy.get('.react-flow')
      .contains('then...Always and forever...')
      .should('be.visible');

    cy.get('[data-cy="undoButton"]').click();

    cy.get('.react-flow').contains('then...').should('be.visible');

    cy.get('[data-cy="node-edge-label"]')
      .contains('then...')
      .should('have.value', 'then...');

    cy.get('[data-cy="redoButton"]').click();

    cy.get('.react-flow')
      .contains('then...Always and forever...')
      .should('be.visible');

    cy.get('[data-cy="node-edge-label"]')
      .contains('then...')
      .should('have.value', 'then...Always and forever...');
  });
});
