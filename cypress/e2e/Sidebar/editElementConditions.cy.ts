describe('edit links conditions', () => {
  before(() => {
    cy.loadApp();
  });

  it('click and undo/redo sidebar on_error', () => {
    cy.get('.react-flow').contains('web app?').parent().click();

    cy.contains('on_error').should('be.visible');
    cy.contains('Conditions').should('be.visible');

    cy.findByLabelText('on_error').click();

    cy.contains('Conditions').should('not.exist');

    // cy.get('[data-cy="undoButton"]').click();

    // cy.contains('Conditions').should('be.visible');

    // cy.get('[data-cy="redoButton"]').click();
  });

  it('insert and undo/redo a new Data Mapping', () => {
    cy.findByLabelText('on_error').click();

    cy.get('[data-cy="addConditionsButton"]').click();

    // cy.get('[data-cy="undoButton"]').click();

    // cy.get('[data-cy="redoButton"]').click();
  });

  it('type and undo/redo a new Condition', () => {
    cy.contains('Conditions').should('be.visible');

    cy.get('[data-cy="addConditionsButton"]').click();

    cy.get('[data-cy="autocompleteInputInEditableCell"]')
      .should('exist')
      .should('be.visible')
      .should('have.length', 2);

    cy.get('[data-cy="doneEditingButtonEditableTable"]')
      .should('exist')
      .should('be.visible');
    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="autocompleteInputInEditableCell"]').should(
      'have.length',
      2
    );
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="autocompleteInputInEditableCell"]')
      .first()
      .type('Always');

    cy.get('[data-cy="radioInEditableCell"]')
      .children('label')
      .first()
      .children('span')
      .first()
      .click();

    cy.get('[data-cy="doneEditingButtonEditableTable"]').first().click();

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');

    // cy.get('[data-cy="undoButton"]').click();

    // cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    // cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    // cy.get('[data-cy="inputInEditableCell"]').should('not.exist');

    // cy.get('[data-cy="redoButton"]').click();

    // cy.get('[data-cy="deleteButtonEditableTable"]').click();

    // cy.get('[data-cy="undoButton"]').click();
    // cy.get('[data-cy="undoButton"]').click();
    // cy.get('[data-cy="undoButton"]').click();
  });
});
