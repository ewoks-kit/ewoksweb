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
    'data-selected'
  );
});

it('should restore an opened workflow when switching pages', () => {
  cy.loadGraph('tutorial_Graph');
  cy.findByRole('heading', { name: 'tutorial_Graph' }).should('be.visible');
  cy.get('.react-flow__node').should('have.length', 17);

  cy.findByRole('link', { name: 'Monitor' }).click();
  cy.waitForStableDOM();

  cy.findByRole('link', { name: 'Edit' }).click();
  cy.waitForStableDOM();
  cy.findByRole('heading', { name: 'tutorial_Graph' }).should('be.visible');
  cy.get('.react-flow__node').should('have.length', 17);
});
