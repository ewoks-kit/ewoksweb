describe('edit links dataMapping', () => {
  before(() => {
    cy.loadApp();
  });

  it('change the canvas color', () => {
    cy.findByRole('button', { name: 'Styling Graph' })
      .should('be.visible')
      .click();

    cy.findByLabelText('Canvas Background Color').should(
      'have.attr',
      'value',
      '#e9ebf7'
    );

    cy.get('.react-flow__background')
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(233, 235, 247)');

    cy.findByLabelText('Canvas Background Color')
      .invoke('val', '#ff0000')
      .trigger('input')
      .should('have.attr', 'value', '#ff0000');

    cy.get('.react-flow__background')
      .should('be.visible')
      .should('have.css', 'background-color', 'rgb(255, 0, 0)');
  });
});
