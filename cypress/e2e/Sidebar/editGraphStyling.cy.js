describe('', () => {
  before(() => {
    cy.loadApp();
  });

  it('change the canvas color', () => {
    cy.contains('Styling Graph').should('be.visible').click();

    cy.contains('Canvas Background Color').should('be.visible');

    cy.get('[data-cy="colorPickerCanvasBackground"]').should(
      'have.attr',
      'value',
      '#e9ebf7'
    );

    cy.get('.react-flow__background')
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(233, 235, 247)');

    cy.get('input[type=color]')
      .invoke('val', '#ff0000')
      .trigger('input')
      .should('have.attr', 'value', '#ff0000');

    cy.get('.react-flow__background')
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });
});
