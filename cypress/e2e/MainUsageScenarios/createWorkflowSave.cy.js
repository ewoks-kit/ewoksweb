/* eslint-disable sonarjs/no-duplicate-string */
// / <reference types="cypress" />

describe('create workflow and save', () => {
  before(() => {
    cy.visit('http://localhost:3000/#/edit-workflows');

    cy.get('label')
      .should('include.text', 'Open Workflow')
      .parents('.MuiAutocomplete-root')
      .click()
      .get('input[type=text]')
      .type('tutorial_Graph');

    cy.contains('tutorial_Graph').parent().click();
    cy.window().should('have.property', '__useStore__');
  });

  it('opens the dialog for name after clicking new', () => {
    cy.get('[data-cy="newWorkflowButton"]').click();

    cy.contains('Give the new Workflow name').should('be.visible');
  });

  it('gives a new unique name creates and deletes workflow', () => {
    cy.window()
      .its('__useStore__')
      .then((store) => {
        const { allWorkflows } = store.getState();

        let id = 11;
        console.log(allWorkflows);
        while (allWorkflows.some((work) => work.id === id.toString())) {
          console.log(id);
          id++;
        }

        cy.contains('New Name - Identifier')
          .siblings('div')
          .children('input')
          .type(id.toString(), { force: true });

        cy.contains('Save Workflow').click();

        cy.get('.react-flow__edge').should('have.length', 0);
        cy.get('.react-flow__node').should('have.length', 0);

        cy.get('label')
          .should('include.text', 'Open Workflow')
          .parents('.MuiAutocomplete-root')
          .click()
          .get('input[type=text]')
          .type(id.toString());

        cy.contains(id.toString()).parent().click();

        cy.get(`[data-cy="${id.toString()}"]`).contains(id.toString());

        cy.get(`[data-cy="tutorial_Graph"]`).should('not.exist');

        cy.get(`[data-cy="sidebarDelete"]`).contains('Delete').click();

        cy.contains(`Delete "${id.toString()}" workflow?`);

        cy.get(`[data-cy="yesButtonConfirmDialod"]`).contains('Yes').click();

        cy.get(`[data-cy="${id.toString()}"]`).should('not.exist');
      });
  });
});
