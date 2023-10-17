beforeEach(() => {
  cy.visit('http://localhost:3000');
});

it('should land on the edit page', () => {
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/edit');
  });
  cy.findByRole('link', { name: 'Edit' }).should('have.attr', 'data-selected');
  cy.get('.react-flow').should('be.visible');
});

it('should switch to monitor page', () => {
  cy.findByRole('link', { name: 'Monitor' }).click();
  cy.location().should((loc) => {
    expect(loc.pathname).to.eq('/monitor');
  });
  cy.findByRole('link', { name: 'Monitor' }).should(
    'have.attr',
    'data-selected',
  );
});

it.skip('should restore an opened workflow when switching pages', () => {
  cy.loadGraph('tutorial_Graph');
  cy.hasBreadcrumbs(['tutorial_Graph']);
  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);

  cy.findByRole('link', { name: 'Monitor' }).click();
  cy.waitForStableDOM();

  // The monitor page has another 'Edit' link if no workflow is executed.
  cy.findByRole('navigation').within(() =>
    cy.findByRole('link', { name: 'Edit' }).click(),
  );
  cy.waitForStableDOM();
  cy.hasBreadcrumbs(['tutorial_Graph']);

  cy.hasVisibleNodes(16);
  cy.hasVisibleEdges(12);
});
