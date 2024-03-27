beforeEach(() => {
  cy.loadAppWithoutGraph();

  cy.findByRole('button', { name: 'ewokscore' }).click();
  cy.dragNodeInCanvas('ewokscore.tests.examples.tasks.sumlist.SumList');
  cy.dragNodeInCanvas('ewokscore.tests.examples.tasks.sumlist.SumList');
  cy.waitForStableDOM();
  cy.findByRole('button', { name: 'SumList0' })
    .find('.react-flow__handle-right')
    .click({ force: true });

  cy.findByRole('button', { name: 'SumList1' })
    .find('.react-flow__handle-left')
    .click({ force: true });

  cy.get('.react-flow__edge')
    .as('link', { type: 'static' })
    .click({ force: true });
});

it('has the default style', () => {
  cy.get('@link')
    .find('.react-flow__edge-path')
    .should(
      'have.attr',
      'style',
      'stroke: rgb(150, 165, 249); stroke-width: 3px;',
    )
    .should('have.attr', 'marker-end', 'url(#1__type=arrowclosed)');
});

it('selects a link and adds selected class and sidebar shows details', () => {
  cy.get('@link').should('include.class', 'selected');

  cy.contains('Map all Data').should('be.visible');

  cy.findByRole('combobox', { name: 'Label' }).should('have.value', '');
});

it('changes label', () => {
  cy.findByRole('combobox', { name: 'Label' })
    .click()
    .type('Link between sum tasks');

  cy.get('@link').contains('Link between sum tasks');
});

it('changes animated property to true', () => {
  cy.findByRole('checkbox', { name: 'animated' }).click();

  cy.get('@link').should('include.class', 'animated');
});

it('changes arrow head property', () => {
  cy.findByRole('combobox', { name: 'Arrow head' }).click();
  cy.findByRole('option', { name: 'arrow' }).click();
  cy.get('@link')
    .find('.react-flow__edge-path')
    .should('have.attr', 'marker-end', 'url(#1__type=arrow)');

  cy.findByRole('combobox', { name: 'Arrow head' }).click();
  cy.findByRole('option', { name: 'none' }).click();
  cy.get('@link')
    .find('.react-flow__edge-path')
    .should('have.attr', 'marker-end', 'url(#)');
});
