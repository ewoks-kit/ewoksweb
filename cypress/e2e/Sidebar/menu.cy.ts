describe('sidebar menu', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  // Stays until decide on the initial screen
  // it('Cannot delete or clone a workflow with an empty canvas', () => {
  //   cy.get('[data-cy="iconMenu"]').click();

  //   cy.get('.MuiListItem-button')
  //     .should('have.length', 2)
  //     .first()
  //     .children('.MuiListItemText-root')
  //     .should('have.length', 1)
  //     .and('have.text', 'Clone Workflow')
  //     .click();

  //   cy.contains('No Workflow to clone!');

  //   cy.get('.MuiListItem-button')
  //     .should('have.length', 2)
  //     .last()
  //     .children('.MuiListItemText-root')
  //     .should('have.length', 1)
  //     .and('have.text', 'Delete Workflow')
  //     .click();

  //   cy.contains('No workflow on canvas to delete!');
  // });

  // TODO: cannot close the menu with clicks outside? So use again loadApp

  it('opens the clone Task form when node is selected', () => {
    cy.loadApp();

    cy.get('.react-flow__nodes')
      .children()
      .filter('.react-flow__node-ppfmethod')
      .first()
      .click();

    cy.get('[data-cy="iconMenu"]').click();

    cy.get('.MuiListItem-button')
      .contains('Create Task from Node')
      .parent()
      .click();

    cy.contains('Give the new Task details')
      .parent()
      .should('have.class', 'MuiDialogTitle-root')
      .siblings()
      .first()
      .as('dialogContent')
      .should('have.class', 'MuiDialogContent-root');
  });

  it('opens the clone Graph form with new workflow name', () => {
    cy.loadApp();

    cy.get('[data-cy="iconMenu"]').click();

    cy.get('.MuiListItem-button').contains('Clone Workflow').parent().click();

    cy.contains('Give the new Workflow name')
      .parent()
      .should('have.class', 'MuiDialogTitle-root')
      .siblings()
      .first()
      .as('dialogContent')
      .should('have.class', 'MuiDialogContent-root');
  });
});
