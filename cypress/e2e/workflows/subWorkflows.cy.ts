it('navigates to a subgraph, a subsubgraph and back', () => {
  cy.loadAppWithoutGraph();
  cy.loadGraph('tutorial_Graph');

  cy.findByRole('heading', { name: 'tutorial_Graph' }).should('be.visible');
  cy.get('.react-flow__node').should('have.length', 16);
  cy.get('.react-flow__edge').should('have.length', 12);

  // Navigate to Editing-Graph-Node-Link subgraph
  cy.findByRole('button', {
    name: /^Double-click for editing Graph-Node-Link/,
  }).dblclick();
  cy.waitForStableDOM();

  cy.findByRole('heading', { name: 'breadcrumb' }).within(() => {
    cy.findByRole('link', { name: 'tutorial_Graph' }).should('be.visible');
    cy.findByRole('link', { name: 'Editing-Graph-Node-Link' }).should(
      'be.visible'
    );
  });
  cy.get('.react-flow__node').should('have.length', 21);
  cy.get('.react-flow__edge').should('have.length', 17);

  // Navigate to Styling-Nodes-Links subgraph
  cy.findByRole('button', {
    name: /^Double-click for styling NODES and LINKS/,
  }).dblclick();
  cy.waitForStableDOM();

  cy.findByRole('heading', { name: 'breadcrumb' }).within(() => {
    cy.findByRole('link', { name: 'tutorial_Graph' }).should('be.visible');
    cy.findByRole('link', { name: 'Editing-Graph-Node-Link' }).should(
      'be.visible'
    );
    cy.findByRole('link', { name: 'Styling-Nodes-Links' }).should('be.visible');
  });
  cy.get('.react-flow__node').should('have.length', 3);
  cy.get('.react-flow__edge').should('have.length', 2);

  // Go back to tutorial graph
  cy.findByRole('link', { name: 'tutorial_Graph' }).click();
  cy.waitForStableDOM();

  cy.findByRole('heading', { name: 'tutorial_Graph' }).should('be.visible');
  cy.get('.react-flow__node').should('have.length', 16);
  cy.get('.react-flow__edge').should('have.length', 12);
});
