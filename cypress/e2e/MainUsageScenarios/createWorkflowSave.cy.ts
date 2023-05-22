import { nanoid } from 'nanoid';

describe('create workflow and save', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('opens the dialog for name after clicking new', () => {
    cy.findByRole('dialog').should('not.exist');

    cy.get('[aria-controls="navbar-dropdown-menu"]').click();

    cy.get('#navbar-dropdown-menu').within(() => {
      cy.contains('[role="menuitem"]', 'New workflow').click();
    });

    cy.findByRole('dialog').should('be.visible');
  });

  it('gives a new unique name creates and deletes workflow', () => {
    const id = nanoid();

    cy.findByRole('textbox', {
      name: 'New Name - Identifier',
    }).type(id);

    cy.findByRole('button', { name: 'Save Workflow' }).click();
    cy.waitForStableDOM();

    cy.get('[aria-controls="navbar-dropdown-menu"]').click({ force: true });

    cy.get('.react-flow__edge').should('have.length', 0);
    cy.get('.react-flow__node').should('have.length', 0);

    cy.get('body').click();
    cy.waitForStableDOM();

    cy.loadGraph(id);

    cy.get(`[data-cy="${id}"]`).contains(id);

    cy.get(`[data-cy="tutorial_Graph"]`).should('not.exist');

    cy.get('[aria-controls="editSidebar-dropdown-menu"]').click();

    cy.contains(`Delete Workflow`).click();

    cy.contains(`Delete workflow with id: "${id}"?`);

    cy.findByRole('button', { name: 'Yes' }).click();

    cy.get(`[data-cy="${id}"]`).should('not.exist');
    cy.get('p').should(
      'include.text',
      'Drag and drop tasks here to start building your workflow,or use Quick Open to open an existing workflow.'
    );
  });
});
