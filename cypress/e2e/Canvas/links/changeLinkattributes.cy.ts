describe('change link attributes', () => {
  before(() => {
    cy.loadApp();

    cy.get('.react-flow').contains('if you do then...').parent().click();
  });

  it('changes links label and is reflected on the canvas', () => {
    cy.findByRole('textbox', { name: 'Label' })
      .contains('if you do then...')
      .should('have.value', 'if you do then...')
      .click()
      .type('Always and forever...');

    cy.findByRole('button', { name: 'saveLabelComment' }).click();

    cy.get('.react-flow')
      .contains('if you do then...Always and forever...')
      .should('be.visible');
  });

  it('changes links animated property to true and is shown on the canvas', () => {
    cy.contains('Styling Link').click({ force: true });

    cy.contains('Animated').siblings().click();

    cy.get('.react-flow')
      .contains('if you do then...')
      .parent()
      .parent()
      .should('include.class', 'animated');
  });

  it('changes links arrowHead property to arrowclosed and is shown on the canvas', () => {
    cy.get('.react-flow')
      .contains('if you do then...Always and forever...')
      .parent()
      .siblings()
      .should('have.attr', 'marker-end', 'url(#)');

    cy.contains('none').click({ force: true });
    cy.contains('arrowclosed').click({ force: true });

    cy.get('.react-flow')
      .contains('if you do then...Always and forever...')
      .parent()
      .siblings()
      .should('have.attr', 'marker-end', 'url(#1__type=arrowclosed)');
  });
});
