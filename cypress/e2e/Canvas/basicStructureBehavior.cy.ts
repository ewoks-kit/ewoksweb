describe('structure and basics for edit workflows', () => {
  before(() => {
    cy.loadApp();
  });

  it('displays the canvas', () => {
    cy.get('.react-flow').should('be.visible');
    cy.get('.react-flow__controls').should('be.visible');
    cy.get('.react-flow__background').should('be.visible');
    cy.get('.react-flow__attribution').should('be.visible');
  });

  it('opens the tutorial_Graph on the canvas', () => {
    cy.contains('tutorial_Graph');
    cy.get('h1').should('include.text', 'tutorial_Graph');
  });

  it('displays the number of nodes the tutorial_Graph has', () => {
    cy.get('.react-flow__node').should('have.length', 17);
  });

  it('displays the number of links the tutorial_Graph has', () => {
    cy.get('.react-flow__edge').should('have.length', 13);
  });
});
