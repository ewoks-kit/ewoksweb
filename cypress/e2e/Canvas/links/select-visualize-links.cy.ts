describe('select visualize links', () => {
  before(() => {
    cy.loadApp();
  });

  it('link has the default style', () => {
    cy.get('.react-flow')
      .contains('if you do then...')
      .should(
        'have.attr',
        'style',
        'fill: rgb(206, 92, 0); font-weight: 500; font-size: 14px; color: rgb(206, 92, 0);'
      )
      .siblings('rect')
      .should(
        'have.attr',
        'style',
        'fill: rgb(223, 226, 247); fill-opacity: 1; stroke-width: 3px; stroke: rgb(206, 92, 0);'
      );
  });

  it('selects a link and adds selected class and sidebar shows details', () => {
    cy.get('.react-flow')
      .contains('if you do then...')
      .parent()
      .click()
      .parent()
      .should('include.class', 'selected');

    cy.contains('Map all data').should('be.visible');

    cy.findByRole('textbox', { name: 'Label' })
      .contains('if you do then...')
      .should('have.value', 'if you do then...');
  });
});
