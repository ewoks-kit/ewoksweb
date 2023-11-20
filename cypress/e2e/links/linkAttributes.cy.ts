beforeEach(() => {
  cy.loadApp();

  cy.get('.react-flow').contains('if you do then...').parent().click();
});

it('link has the default style', () => {
  cy.get('.react-flow')
    .contains('if you do then...')
    .should(
      'have.attr',
      'style',
      'fill: rgb(206, 92, 0); font-weight: 500; font-size: 14px; color: rgb(206, 92, 0);',
    )
    .siblings('rect')
    .should(
      'have.attr',
      'style',
      'fill: rgb(223, 226, 247); fill-opacity: 1; stroke-width: 3px; stroke: rgb(206, 92, 0);',
    );
});

it('selects a link and adds selected class and sidebar shows details', () => {
  cy.get('.react-flow')
    .contains('if you do then...')
    .parent()
    .parent()
    .should('include.class', 'selected');

  cy.contains('Map all Data').should('be.visible');

  cy.findByRole('combobox', { name: 'Label' })
    .contains('if you do then...')
    .should('have.value', 'if you do then...');
});

it('changes links label and is reflected on the canvas', () => {
  cy.findByRole('combobox', { name: 'Label' })
    .contains('if you do then...')
    .should('have.value', 'if you do then...')
    .click()
    .type('Always and forever...');

  cy.get('.react-flow')
    .contains('if you do then...Always and forever...')
    .should('be.visible');
});

it('changes links animated property to true and is shown on the canvas', () => {
  cy.contains('Animated').siblings().click();

  cy.get('.react-flow')
    .contains('if you do then...')
    .parent()
    .parent()
    .should('include.class', 'animated');
});

it('changes links arrowHead property to arrowclosed and is shown on the canvas', () => {
  cy.get('.react-flow')
    .contains('if you do then...')
    .parent()
    .siblings()
    .should('have.attr', 'marker-end', 'url(#)');

  cy.contains('none').click({ force: true });
  cy.contains('arrowclosed').click({ force: true });

  cy.get('.react-flow')
    .contains('if you do then...')
    .parent()
    .siblings()
    .should('have.attr', 'marker-end', 'url(#1__type=arrowclosed)');
});
