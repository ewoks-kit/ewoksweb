describe('test newGraph scenarios', () => {
  before(() => {
    cy.loadAppWithoutGraph();
  });

  it('Initially it displays the empty canvas', () => {
    cy.get('.react-flow').should('be.visible');
    cy.get('.react-flow__controls').should('be.visible');
    cy.get('.react-flow__background').should('be.visible');
    cy.get('.react-flow__attribution').should('be.visible');
  });

  it('...then open a graph and show graph details', () => {
    cy.loadGraph('tutorial_Graph');
    cy.contains('tutorial_Graph');
    cy.get('h1').should('include.text', 'tutorial_Graph');
  });
});
