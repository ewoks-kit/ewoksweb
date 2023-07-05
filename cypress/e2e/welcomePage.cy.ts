before(() => {
  cy.visit('http://localhost:3000');
});
// Deactivate tests for as long as there is no need for a first page
it.only('displays a welcome message', () => {
  cy.get('.react-flow').should('be.visible');
  // cy.get('h1').should('include.text', 'Welcome to the Ewoks-UI');
  // cy.location('pathname').should('not.include', 'edit');
  // cy.location('pathname').should('not.include', 'monitor');
});

// TODO: get back to 3 options for onlyEditRelease
it('offers 2 options to go ahead', () => {
  cy.get('a').should('have.length', 4);
});

it('has an img of the canvas', () => {
  cy.get('img').should('have.length', 1);
});

it('gets to editing when the appropriate button is pressed', () => {
  cy.get('a').first().should('have.text', 'Edit Workflows');
  cy.get('a').first().click();
  cy.contains('tutorial_Graph').should('not.exist');

  cy.location().should((loc) => {
    expect(loc.hash).to.eq('/edit');
    expect(loc.host).to.eq('localhost:3000');
  });

  cy.go('back');
});
