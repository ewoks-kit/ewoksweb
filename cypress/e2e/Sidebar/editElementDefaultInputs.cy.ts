describe('edit nodes defaultInputs', () => {
  before(() => {
    cy.loadApp();
  });

  it('click on a node and see Default Inputs', () => {
    cy.get('.react-flow').contains('ewoksweb').parent().click({ force: true });

    cy.contains('Default Inputs').should('be.visible');
  });

  it('insert a new Default Input', () => {
    cy.findAllByRole('row').should('have.length', 2); // Header + Button

    cy.findByRole('button', { name: 'Add row' }).click();

    cy.findAllByRole('row').should('have.length', 3); // Header + New Row + Button
  });

  it('type and undo/redo a new Default Input', () => {
    cy.contains('Default Inputs').should('be.visible');

    cy.get('[data-cy="autocompleteInputInEditableCell"]')
      .should('exist')
      .should('be.visible');

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="autocompleteInputInEditableCell"]').should(
      'have.length',
      1
    );

    cy.get('[data-cy="autocompleteInputInEditableCell"]').type('Always');
    cy.get('[data-cy="inputInEditableCell"]').type('and forever');

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');

    // cy.get('[data-cy="undoButton"]').click();

    // cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    // cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    // cy.get('[data-cy="inputInEditableCell"]').should('not.exist');

    // cy.get('[data-cy="redoButton"]').click();

    // cy.get('[data-cy="deleteButtonEditableTable"]').click();

    // cy.get('[data-cy="undoButton"]').click();
    // cy.get('[data-cy="undoButton"]').click();
    // cy.get('[data-cy="undoButton"]').click();
  });
});
