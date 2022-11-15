/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('structure and basics for edit-workflows', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.get('label')
      .should('include.text', 'Open Workflow')
      .parents('.MuiAutocomplete-root')
      .click()
      .get('input[type=text]')
      .type('tutorial_Graph');

    cy.contains('tutorial_Graph').parent().click();
  });

  it('selects a default node', () => {
    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .click();
  });

  it('changes label of node', () => {
    cy.get('[data-cy="node-edge-label"]')
      .first()
      .should('be.visible')
      .click()
      .type('Always and forever...');

    cy.get('[data-cy="saveLabelComment"]').click();

    cy.get('.react-flow')
      .contains('Always and forever...')
      .should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) => store.getState().selectedElement.label)
      .as('label')
      .should('include', 'Always and forever...');
  });

  // change comment of node and see it on hover? click Advanced, type comment and hover node
  it('changes comment of node', () => {
    cy.contains('Advanced').siblings().click();

    cy.get('[data-cy="node-edge-label"]')
      .last()
      .should('be.visible')
      .click()
      .type('Always and forever comment...');

    cy.get('[data-cy="saveLabelComment"]').click();

    cy.get('.react-flow')
      .contains('Always and forever...')
      .should('be.visible')
      .click();

    cy.get('#root')
      .contains('Always and forever comment...')
      .should('be.visible');

    cy.window()
      .its('__state__')
      .then((store) => store.getState().selectedElement.data.comment)
      .as('label')
      .should('include', 'Always and forever comment...');
  });

  // change withImage of node back and forth

  // change withLabel of node back and forth

  // change width of node back and forth

  // change moreHandles of node back and forth

  // delete a node by button and keyboard
});
