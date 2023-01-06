describe('edit links dataMapping', () => {
  before(() => {
    cy.loadApp();
  });

  it('click and undo/redo sidebar Map all Data', () => {
    cy.get('.react-flow').contains('web app?').parent().click();

    cy.contains('Map all Data').should('be.visible');

    cy.findByLabelText('Map all Data').click();

    cy.get('[data-cy="undoButton"]').click();

    cy.get('[data-cy="redoButton"]').click();
  });

  it('insert and undo/redo a new Data Mapping', () => {
    cy.contains('Data Mapping').should('be.visible');

    cy.get('[data-cy="editButtonEditableTable"]').should('not.exist');

    cy.get('[data-cy="addDataMappingButton"]').click();

    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="undoButton"]').click();

    cy.get('[data-cy="redoButton"]').click();
  });

  it('type and undo/redo a new Data Mapping', () => {
    cy.contains('Data Mapping').should('be.visible');

    cy.get('[data-cy="addDataMappingButton"]').click();

    cy.contains('Please fill in the empty line before adding another!').should(
      'be.visible'
    );

    cy.get('[data-cy="inputInEditableCell"]').should('not.exist');
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('not.exist');
    cy.get('[data-cy="deleteButtonEditableTable"]').should('be.visible');
    cy.get('[data-cy="editButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="editButtonEditableTable"]').click();

    cy.get('[data-cy="inputInEditableCell"]').should('have.length', 2);
    cy.get('[data-cy="doneEditingButtonEditableTable"]').should('be.visible');

    cy.get('[data-cy="inputInEditableCell"]').first().type('Always');
    cy.get('[data-cy="inputInEditableCell"]').last().type('and forever');

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
