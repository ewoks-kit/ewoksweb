describe('edit links conditions', () => {
  before(() => {
    cy.loadApp();
  });

  it('click and undo/redo sidebar on_error', () => {
    cy.get('.react-flow').contains('web app?').parent().click({ force: true });

    cy.contains('on_error').should('be.visible');
    cy.contains('Conditions').should('be.visible');

    cy.get('.MuiSwitch-thumb').last().click({ force: true });

    // cy.contains('Conditions').should('not.exist');

    // cy.get('[data-cy="undoButton"]').click();

    // cy.contains('Conditions').should('be.visible');

    // cy.get('[data-cy="redoButton"]').click();
  });

  it('insert and undo/redo a new Data Mapping', () => {
    cy.get('.MuiSwitch-thumb').last().click({ force: true });

    cy.findByRole('button', { name: 'Add row' }).click();

    // cy.get('[data-cy="undoButton"]').click();

    // cy.get('[data-cy="redoButton"]').click();
  });

  it('type and undo/redo a new Condition', () => {
    cy.findByRole('button', { name: 'Add row' }).click();

    cy.get('[data-cy="inputInEditableCell"]')
      .should('exist')
      .should('be.visible')
      .should('have.length', 2);

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 2);

    cy.get('[data-cy="inputInEditableCell"]').first().type('Always');

    cy.get('[data-cy="radioInEditableCell"]')
      .children('label')
      .first()
      .children('span')
      .first()
      .click();

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');

    // cy.get('[data-cy="undoButton"]').click();

    // cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    // cy.get('[data-cy="inputInEditableCell"]').should('not.exist');

    // cy.get('[data-cy="redoButton"]').click();

    // cy.get('[data-cy="deleteButtonEditableTable"]').click();

    // cy.get('[data-cy="undoButton"]').click();
    // cy.get('[data-cy="undoButton"]').click();
    // cy.get('[data-cy="undoButton"]').click();
  });
});
