import { nanoid } from 'nanoid';

describe('create workflow and save', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('opens the dialog for name after clicking new', () => {
    cy.findByRole('dialog').should('not.exist');

    cy.findByRole('button', { name: 'Start a new workflow' }).click();

    cy.findByRole('dialog').should('be.visible');
  });

  it('gives a new unique name creates and deletes workflow', () => {
    const id = nanoid();

    cy.findByRole('textbox', {
      name: 'New Name - Identifier',
    }).type(id);

    cy.findByRole('button', { name: 'Save Workflow' }).click();
    cy.waitForStableDOM();

    cy.get('.react-flow__edge').should('have.length', 0);
    cy.get('.react-flow__node').should('have.length', 1);

    cy.loadGraph('untitled_workflow' + id);

    cy.get(`[data-cy="${'untitled_workflow' + id}"]`).contains(id);

    cy.get(`[data-cy="tutorial_Graph"]`).should('not.exist');

    cy.get('[data-cy="iconMenu"]').click();

    cy.contains(`Delete Workflow`).click();

    cy.contains(`Delete workflow with id: "${'untitled_workflow' + id}"?`);

    cy.findByRole('button', { name: 'Yes' }).click();

    cy.get(`[data-cy="${'untitled_workflow' + id}"]`).should('not.exist');
  });
});
