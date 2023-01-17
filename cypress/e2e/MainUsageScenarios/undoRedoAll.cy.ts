describe('undo-redo functionality', () => {
  before(() => {
    cy.loadApp();
  });

  it('initially there is no back or forth', () => {
    cy.get('[data-cy="undoButton"]').click();

    cy.contains('No more back or forth!').should('be.visible');

    cy.get('[data-cy="redoButton"]').click();

    cy.contains('No more back or forth!').should('be.visible');
  });

  it('type and undo/redo sidebar label', () => {
    cy.get('.react-flow').contains('if you do then...').parent().click();

    cy.findByRole('textbox', { name: 'Label' })
      .contains('if you do then...')
      .should('have.value', 'if you do then...')
      .click()
      .type('Always and forever...');

    cy.get('[data-cy="saveLabelComment"]').click();

    cy.get('.react-flow')
      .contains('if you do then...Always and forever...')
      .should('be.visible');

    cy.get('[data-cy="undoButton"]').click();

    cy.get('.react-flow').contains('if you do then...').should('be.visible');

    cy.findByRole('textbox', { name: 'Label' })
      .contains('if you do then...')
      .should('have.value', 'if you do then...');

    cy.get('[data-cy="redoButton"]').click();

    cy.get('.react-flow')
      .contains('if you do then...Always and forever...')
      .should('be.visible');

    cy.findByRole('textbox', { name: 'Label' })
      .contains('if you do then...')
      .should('have.value', 'if you do then...Always and forever...');
  });
});
