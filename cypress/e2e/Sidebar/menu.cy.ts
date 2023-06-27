describe('sidebar menu', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  // Stays until decide on the initial screen
  it('Cannot delete or clone a workflow with an empty canvas', () => {
    cy.get('[aria-controls="editSidebar-dropdown-menu"]').click();

    cy.get('#editSidebar-dropdown-menu').within(() => {
      cy.contains('[role="sidebarMenuItem"]', 'Clone Workflow').should(
        'have.class',
        'Mui-disabled'
      );
    });

    cy.get('#editSidebar-dropdown-menu').within(() => {
      cy.contains('[role="sidebarMenuItem"]', 'Delete Workflow').should(
        'have.class',
        'Mui-disabled'
      );
    });

    cy.get('body').click();
  });

  it('opens the clone Graph form with new workflow name', () => {
    cy.loadApp();
    cy.get('[aria-controls="editSidebar-dropdown-menu"]').click();

    cy.get('#editSidebar-dropdown-menu').within(() => {
      cy.contains('[role="sidebarMenuItem"]', 'Clone Workflow').click();
    });

    cy.waitForStableDOM();

    cy.contains('Give the new Workflow name')
      .parent()
      .should('have.class', 'MuiDialogTitle-root')
      .siblings()
      .first()
      .as('dialogContent')
      .should('have.class', 'MuiDialogContent-root');

    cy.loadApp();
  });

  it('opens the clone Task form when node is selected', () => {
    cy.get('.react-flow').contains('ewoksweb').parent().click({ force: true });

    cy.waitForStableDOM();

    cy.get('[aria-controls="editSidebar-dropdown-menu"]').click();

    cy.get('.MuiListItem-button')
      .contains('Create Task from Node')
      .parent()
      .click();

    cy.contains('Create task')
      .parent()
      .should('have.class', 'MuiDialogTitle-root')
      .siblings()
      .first()
      .as('dialogContent')
      .should('have.class', 'MuiDialogContent-root');

    cy.findByRole('button', { name: 'Cancel' }).click({ force: true });
    cy.get('body').click();
  });
});
