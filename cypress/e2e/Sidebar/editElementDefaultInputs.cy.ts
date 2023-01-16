describe('edit nodes defaultInputs', () => {
  before(() => {
    cy.loadApp();
  });

  it('click on a node and see Default Inputs', () => {
    cy.get('.react-flow').contains('ewoksweb').parent().click();

    cy.contains('Default Inputs').should('be.visible');
  });

  it('insert and undo/redo a new Default Input', () => {
    cy.get('[data-cy="editButtonEditableTable"]').should('not.exist');

    cy.get('[data-cy="addDefaultInputsButton"]').click();

    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="undoButton"]').click();

    cy.get('[data-cy="redoButton"]').click();
  });

  it('type and undo/redo a new Default Input', () => {
    cy.contains('Default Inputs').should('be.visible');

    cy.get('[data-cy="addDefaultInputsButton"]').click();

    cy.contains('Please fill in the empty line before adding another!').should(
      'be.visible'
    );

    cy.get('[data-cy="autocompleteInputInEditableCell"]').should('not.exist');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="editButtonEditableTable"]').click();

    cy.get('[data-cy="autocompleteInputInEditableCell"]').should(
      'have.length',
      1
    );
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="autocompleteInputInEditableCell"]').type('Always');
    cy.get('[data-cy="inputInEditableCell"]').type('and forever');

    cy.get('[data-cy="doneEditingButtonEditableTable"]').click();

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');

    cy.get('[data-cy="undoButton"]').click();

    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.get('[data-cy="inputInEditableCell"]').should('not.exist');

    cy.get('[data-cy="redoButton"]').click();

    cy.get('[data-cy="deleteButtonEditableTable"]').click();

    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();
    cy.get('[data-cy="undoButton"]').click();
  });
});
