import { nanoid } from 'nanoid';

describe('create workflow and save', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('opens the dialog for name after clicking new', () => {
    cy.get('[data-cy="newWorkflowButton"]').click();

    cy.contains('Give the new Workflow name').should('be.visible');
  });

  it('gives a new unique name creates and deletes workflow', () => {
    const id = nanoid();

    cy.contains('New Name - Identifier')
      .siblings('div')
      .children('input')
      .type(id.toString());

    cy.contains('Save Workflow').click();
    cy.waitForStableDOM();

    cy.get('.react-flow__edge').should('have.length', 0);
    cy.get('.react-flow__node').should('have.length', 0);

    cy.get('[data-testid="async-autocomplete-drop"]')
      .click()
      .get('input[type=text]')
      .type(id.toString());

    cy.contains(id.toString()).click();

    cy.get(`[data-cy="${id.toString()}"]`).contains(id.toString());

    cy.get(`[data-cy="tutorial_Graph"]`).should('not.exist');

    cy.get(`[data-cy="sidebarDelete"]`).contains('Delete').click();

    cy.contains(`Delete "${id.toString()}" workflow?`);

    cy.get(`[data-cy="yesButtonConfirmDialog"]`).contains('Yes').click();

    cy.get(`[data-cy="${id.toString()}"]`).should('not.exist');
  });
});
